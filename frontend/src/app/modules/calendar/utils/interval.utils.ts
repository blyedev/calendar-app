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

export function adjustInterval(
  referenceInterval: Interval,
  targetInterval: Interval,
): Interval {
  const adjustedStart =
    targetInterval.start < referenceInterval.start
      ? new Date(referenceInterval.start)
      : new Date(targetInterval.start);
  const adjustedEnd =
    targetInterval.end > referenceInterval.end
      ? new Date(referenceInterval.end)
      : new Date(targetInterval.end);
  return { start: adjustedStart, end: adjustedEnd };
}

export function calculateUnixDuration(interval: Interval): number {
  const start = new Date(interval.start).getTime();
  const end = new Date(interval.end).getTime();
  return end - start;
}
