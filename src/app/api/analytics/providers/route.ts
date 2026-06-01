import { NextRequest } from "next/server";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/features/analytics/lib/api-utils";
import { parseDateRange } from "@/features/analytics/lib/date-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "30d";
    
    const { startDate, endDate } = parseDateRange(range);

    const isAdminQuery = searchParams.get("admin") === "true";
    if (isAdminQuery && (session.user as any).role !== "ADMIN") {
      return errorResponse("Unauthorized", 403);
    }

    const whereCondition: import("@prisma/client").Prisma.GenerationHistoryWhereInput = {
      createdAt: { gte: startDate, lte: endDate },
      aiProviderId: { not: null }
    };

    if (!isAdminQuery) {
      whereCondition.userId = session.user.id;
    }

    const providerUsage = await prisma.generationHistory.groupBy({
      by: ["aiProviderId"],
      where: whereCondition,
      _count: true,
      _sum: {
        inputTokens: true,
        outputTokens: true,
        costUsd: true
      }
    });

    // Fetch provider names for the IDs
    const providerIds = providerUsage.map((p: any) => p.aiProviderId as string);
    const providers = await prisma.aIProvider.findMany({
      where: { id: { in: providerIds } },
      select: { id: true, name: true }
    });

    const providerMap = new Map(providers.map((p: any) => [p.id, p]));

    const formattedData = providerUsage.map((usage: any) => {
      const provider = providerMap.get(usage.aiProviderId as string);
      return {
        providerId: usage.aiProviderId,
        providerName: provider?.name || "Unknown Provider",
        generations: usage._count,
        totalTokens: (usage._sum.inputTokens || 0) + (usage._sum.outputTokens || 0),
        costUsd: usage._sum.costUsd || 0
      };
    }).sort((a: any, b: any) => b.generations - a.generations);

    return successResponse({
      data: formattedData
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized or Server Error";
    return errorResponse(message, 500);
  }
}
