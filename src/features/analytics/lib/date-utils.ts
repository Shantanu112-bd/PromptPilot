import { subDays, subMonths, startOfDay, eachDayOfInterval, format } from "date-fns";

export function parseDateRange(range: string | null): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  let startDate = new Date();

  switch (range) {
    case "24h":
      startDate = subDays(endDate, 1);
      break;
    case "7d":
      startDate = subDays(endDate, 7);
      break;
    case "30d":
      startDate = subDays(endDate, 30);
      break;
    case "90d":
      startDate = subDays(endDate, 90);
      break;
    case "12m":
      startDate = subMonths(endDate, 12);
      break;
    case "all":
    default:
      startDate = new Date(0); // Epoch
      break;
  }

  return { startDate, endDate };
}

export function generateDailyBuckets(startDate: Date, endDate: Date) {
  // If the range is "all" or very large, we might cap it to avoid huge memory usage,
  // but for a typical 30d/90d it's fine to return a day array.
  if (startDate.getTime() === 0) {
    return []; // For "all", we might just return the raw grouping rather than padding
  }

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.map(d => format(startOfDay(d), "yyyy-MM-dd"));
}
