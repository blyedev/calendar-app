import { Interval } from 'src/app/core/models/calendar.models';

export function intervalsOverlap(...intervals: Interval[]): boolean {
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (
        intervals[i].end > intervals[j].start &&
        intervals[i].start < intervals[j].end
      ) {
        return true;
      }
    }
  }
  return false;
}

export function intervalOverlapsWithAny(
  original: Interval,
  ...intervals: Interval[]
): boolean {
  return intervals.some((iv) => {
    return intervalsOverlap(original, iv);
  });
}

export function intervalDaysOverlap(...intervals: Interval[]): boolean {
  const adjustedIntervals = intervals.map((interval) => {
    const start = new Date(interval.start);
    const end = new Date(interval.end);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    if (end < interval.end) {
      end.setDate(end.getDate() + 1);
    }
    return { start, end };
  });

  return intervalsOverlap(...adjustedIntervals);
}

export function intervalDayOverlapsWithAny(
  original: Interval,
  ...intervals: Interval[]
): boolean {
  return intervals.some((iv) => {
    return intervalDaysOverlap(original, iv);
  });
}

export function calculateUnixDuration(interval: Interval): number {
  const start = new Date(interval.start).getTime();
  const end = new Date(interval.end).getTime();
  return end - start;
}

export function calculateDaysDuration(interval: Interval): number {
  const start = new Date(interval.start);
  const end = new Date(interval.end);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  if (end < interval.end) {
    end.setDate(end.getDate() + 1);
  }

  const startTime = start.getTime();
  const endTime = end.getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return (endTime - startTime) / millisecondsPerDay;
}
