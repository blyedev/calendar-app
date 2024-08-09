import { Interval } from 'src/app/core/models/calendar.models';

export function intervalsOverlap(
  interval1: Interval,
  interval2: Interval,
): boolean {
  return interval1.end > interval2.start && interval1.start < interval2.end;
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
