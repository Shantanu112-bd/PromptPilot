import { NextRequest } from "next/server";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/features/analytics/lib/api-utils";
import { parseDateRange } from "@/features/analytics/lib/date-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    
    // Admin protection
    if (session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized: Admin access required", 403);
    }

    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "30d";
    
    const { startDate, endDate } = parseDateRange(range);

    const userActivity = await prisma.generationHistory.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: true,
      _sum: {
        costUsd: true,
        inputTokens: true,
        outputTokens: true
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      },
      take: 100 // Top 100 users
    });

    const userIds = userActivity.map(u => u.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    });

    const userMap = new Map(users.map(u => [u.id, u]));

    const formattedData = userActivity.map(activity => {
      const user = userMap.get(activity.userId);
      return {
        userId: activity.userId,
        name: user?.name || "Unknown User",
        email: user?.email || "unknown@example.com",
        generations: activity._count,
        totalTokens: (activity._sum.inputTokens || 0) + (activity._sum.outputTokens || 0),
        costUsd: activity._sum.costUsd || 0
      };
    });

    return successResponse({
      data: formattedData
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized or Server Error";
    return errorResponse(message, 500);
  }
}
