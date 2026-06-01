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
      modelId: { not: null }
    };

    if (!isAdminQuery) {
      whereCondition.userId = session.user.id;
    }

    const modelUsage = await prisma.generationHistory.groupBy({
      by: ["modelId"],
      where: whereCondition,
      _count: true,
      _sum: {
        inputTokens: true,
        outputTokens: true,
        costUsd: true
      }
    });

    // Fetch model names for the IDs
    const modelIds = modelUsage.map((m: any) => m.modelId as string);
    const models = await prisma.model.findMany({
      where: { id: { in: modelIds } },
      select: { id: true, name: true, providerId: true }
    });

    const modelMap = new Map(models.map((m: any) => [m.id, m]));

    const formattedData = modelUsage.map((usage: any) => {
      const model = modelMap.get(usage.modelId as string);
      return {
        modelId: usage.modelId,
        modelName: model?.name || "Unknown Model",
        providerId: model?.providerId || null,
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
