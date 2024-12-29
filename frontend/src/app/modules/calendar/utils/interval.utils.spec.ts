import { Interval } from '../models/calendar.models';
import {
  intervalsOverlap,
  intervalOverlapsWithAny,
  adjustInterval,
  calculateUnixDuration,
} from './interval.utils';

describe('intervalsOverlap', () => {
  it('should return false when intervals do not overlap', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-03'),
      end: new Date('2023-01-04'),
    };
    expect(intervalsOverlap(interval1, interval2)).toBe(false);
  });

  it('should return true when intervals overlap', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-03'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02'),
      end: new Date('2023-01-04'),
    };
    expect(intervalsOverlap(interval1, interval2)).toBe(true);
  });

  it('should return false when intervals touch but do not overlap', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02'),
      end: new Date('2023-01-03'),
    };
    expect(intervalsOverlap(interval1, interval2)).toBe(false);
  });

  it('should return true when intervals overlap by one millisecond', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T00:00:00.000Z'),
      end: new Date('2023-01-02T00:00:00.001Z'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02T00:00:00.000Z'),
      end: new Date('2023-01-03T00:00:00.000Z'),
    };
    expect(intervalsOverlap(interval1, interval2)).toBe(true);
  });
});

describe('intervalOverlapsWithAny', () => {
  it('should return false when no intervals overlap with the original', () => {
    const original: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
    };
    const interval1: Interval = {
      start: new Date('2023-01-03'),
      end: new Date('2023-01-04'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-05'),
      end: new Date('2023-01-06'),
    };
    expect(intervalOverlapsWithAny(original, interval1, interval2)).toBe(false);
  });

  it('should return true when at least one interval overlaps with the original', () => {
    const original: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-03'),
    };
    const interval1: Interval = {
      start: new Date('2023-01-02'),
      end: new Date('2023-01-04'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-05'),
      end: new Date('2023-01-06'),
    };
    expect(intervalOverlapsWithAny(original, interval1, interval2)).toBe(true);
  });
});

describe('adjustInterval', () => {
  it('should adjust the interval to fit within the reference interval', () => {
    const referenceInterval: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-05'),
    };
    const targetInterval: Interval = {
      start: new Date('2023-01-02'),
      end: new Date('2023-01-06'),
    };
    const adjustedInterval = adjustInterval(referenceInterval, targetInterval);

    expect(adjustedInterval.start).toEqual(new Date('2023-01-02'));
    expect(adjustedInterval.end).toEqual(new Date('2023-01-05'));
  });

  it('should return a new interval and not mutate the original interval', () => {
    const referenceInterval: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-05'),
    };
    const targetInterval: Interval = {
      start: new Date('2023-01-02'),
      end: new Date('2023-01-06'),
    };
    const adjustedInterval = adjustInterval(referenceInterval, targetInterval);

    expect(adjustedInterval).not.toBe(targetInterval);
    expect(adjustedInterval.start).not.toBe(targetInterval.start);
    expect(adjustedInterval.end).not.toBe(targetInterval.end);
    expect(targetInterval.start).toEqual(new Date('2023-01-02'));
    expect(targetInterval.end).toEqual(new Date('2023-01-06'));
  });
});

describe('calculateUnixDuration', () => {
  it('should correctly calculate the duration in milliseconds', () => {
    const interval: Interval = {
      start: new Date('2023-01-01T00:00:00.000Z'),
      end: new Date('2023-01-02T00:00:00.000Z'),
    };
    const duration = calculateUnixDuration(interval);
    expect(duration).toBe(24 * 60 * 60 * 1000); // 1 day in milliseconds
  });

  it('should return 0 if the start and end times are the same', () => {
    const interval: Interval = {
      start: new Date('2023-01-01T00:00:00.000Z'),
      end: new Date('2023-01-01T00:00:00.000Z'),
    };
    const duration = calculateUnixDuration(interval);
    expect(duration).toBe(0);
  });
});
