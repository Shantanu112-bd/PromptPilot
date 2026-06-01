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
      toolId: { not: null }
    };

    if (!isAdminQuery) {
      whereCondition.userId = session.user.id;
    }

    const toolUsage = await prisma.generationHistory.groupBy({
      by: ["toolId"],
      where: whereCondition,
      _count: true,
      _sum: {
        inputTokens: true,
        outputTokens: true
      }
    });

    // Fetch tool names for the IDs
    const toolIds = toolUsage.map((t: any) => t.toolId as string);
    const tools = await prisma.tool.findMany({
      where: { id: { in: toolIds } },
      select: { id: true, name: true, slug: true }
    });

    const toolMap = new Map(tools.map((t: any) => [t.id, t]));

    const formattedData = toolUsage.map((usage: any) => {
      const tool = toolMap.get(usage.toolId as string);
      return {
        toolId: usage.toolId,
        toolName: tool?.name || "Unknown Tool",
        toolSlug: tool?.slug || "unknown",
        generations: usage._count,
        totalTokens: (usage._sum.inputTokens || 0) + (usage._sum.outputTokens || 0)
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
