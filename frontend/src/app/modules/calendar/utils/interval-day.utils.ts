import { Interval } from 'src/app/core/models/calendar.models';
import { adjustInterval, intervalsOverlap } from './interval.utils';

export function calculateIntervalDay(interval: Interval): Interval {
  const start = new Date(interval.start);
  const end = new Date(interval.end);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  if (end < interval.end) {
    end.setDate(end.getDate() + 1);
  }

  return { start, end };
}

export function intervalDaysOverlap(
  interval1: Interval,
  interval2: Interval,
): boolean {
  const intervalDay1 = calculateIntervalDay(interval1);
  const intervalDay2 = calculateIntervalDay(interval2);
  return intervalsOverlap(intervalDay1, intervalDay2);
}

export function intervalDayOverlapsWithAny(
  original: Interval,
  ...intervals: Interval[]
): boolean {
  return intervals.some((iv) => {
    return intervalDaysOverlap(original, iv);
  });
}

export function adjustIntervalDay(
  referenceInterval: Interval,
  targetInterval: Interval,
): Interval {
  const refIntervalDay = calculateIntervalDay(referenceInterval);
  const targetIntervalDay = calculateIntervalDay(targetInterval);
  return adjustInterval(refIntervalDay, targetIntervalDay);
}

export function calculateDaysDuration(startDate: Date, endDate: Date): number {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return (endTime - startTime) / millisecondsPerDay;
}
