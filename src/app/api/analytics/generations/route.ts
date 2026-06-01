import { NextRequest } from "next/server";
import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/features/analytics/lib/api-utils";
import { parseDateRange, generateDailyBuckets } from "@/features/analytics/lib/date-utils";
import { format } from "date-fns";

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

    const history = await prisma.generationHistory.findMany({
      where: whereCondition,
      select: {
        createdAt: true,
        inputTokens: true,
        outputTokens: true,
        status: true
      }
    });

    const buckets = generateDailyBuckets(startDate, endDate);
    const timeSeriesData: Record<string, any> = {};

    // Initialize all buckets
    buckets.forEach((date: string) => {
      timeSeriesData[date] = {
        date,
        totalGenerations: 0,
        successfulGenerations: 0,
        failedGenerations: 0,
        totalTokens: 0
      };
    });

    // Populate with actual data
    history.forEach((record: any) => {
      const dateKey = format(record.createdAt, "yyyy-MM-dd");
      if (timeSeriesData[dateKey]) {
        timeSeriesData[dateKey].totalGenerations += 1;
        timeSeriesData[dateKey].totalTokens += (record.inputTokens + record.outputTokens);
        
        if (record.status === "COMPLETED") timeSeriesData[dateKey].successfulGenerations += 1;
        if (record.status === "FAILED") timeSeriesData[dateKey].failedGenerations += 1;
      }
    });

    // Convert object back to array, sorted by date
    const seriesArray = Object.values(timeSeriesData).sort((a, b) => a.date.localeCompare(b.date));

    return successResponse({
      series: seriesArray
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized or Server Error";
    return errorResponse(message, 500);
  }
}
