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

export function intervalDaysOverlap(...intervals: Interval[]): boolean {
  const intervalDays = intervals.map(calculateIntervalDay);
  return intervalsOverlap(...intervalDays);
}

export function calculateDaysDuration(interval: Interval): number {
  const intervalDay = calculateIntervalDay(interval);

  const startTime = intervalDay.start.getTime();
  const endTime = intervalDay.end.getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return (endTime - startTime) / millisecondsPerDay;
}
