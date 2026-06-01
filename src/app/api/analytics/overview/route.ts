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
      createdAt: { gte: startDate, lte: endDate }
    };

    if (!isAdminQuery) {
      whereCondition.userId = session.user.id;
    }

    // Total Prompts Generated & Status
    const statusCounts = await prisma.generationHistory.groupBy({
      by: ["status"],
      where: whereCondition,
      _count: true
    });

    // Token Usage & Cost
    const aggregates = await prisma.generationHistory.aggregate({
      where: whereCondition,
      _sum: {
        inputTokens: true,
        outputTokens: true,
        costUsd: true
      },
      _avg: {
        latencyMs: true
      }
    });

    let totalGenerations = 0;
    let successfulGenerations = 0;
    let failedGenerations = 0;

    statusCounts.forEach((status: any) => {
      totalGenerations += status._count;
      if (status.status === "COMPLETED") successfulGenerations += status._count;
      if (status.status === "FAILED") failedGenerations += status._count;
    });

    const successRate = totalGenerations > 0 ? (successfulGenerations / totalGenerations) * 100 : 0;
    const errorRate = totalGenerations > 0 ? (failedGenerations / totalGenerations) * 100 : 0;

    return successResponse({
      metrics: {
        totalGenerations,
        successfulGenerations,
        failedGenerations,
        successRate: Number(successRate.toFixed(2)),
        errorRate: Number(errorRate.toFixed(2)),
        inputTokens: aggregates._sum.inputTokens || 0,
        outputTokens: aggregates._sum.outputTokens || 0,
        totalTokens: (aggregates._sum.inputTokens || 0) + (aggregates._sum.outputTokens || 0),
        avgLatencyMs: Math.round(aggregates._avg.latencyMs || 0),
        estimatedCostUsd: Number(aggregates._sum.costUsd?.toFixed(4) || 0)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized or Server Error";
    return errorResponse(message, 500);
  }
}
