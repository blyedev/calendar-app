import {
  calculateIntervalDay,
  intervalDayOverlapsWithAny,
  adjustIntervalDay,
  intervalDaysOverlap,
  calculateDaysDuration,
} from './interval-day.utils';
import { Interval } from 'src/app/core/models/calendar.models';

describe('calculateIntervalDay', () => {
  it('should calculate the interval day by setting start and end to midnight', () => {
    const interval: Interval = {
      start: new Date('2023-01-01T14:00:00'),
      end: new Date('2023-01-02T03:00:00'),
    };
    const originalInterval = {
      start: new Date(interval.start),
      end: new Date(interval.end),
    };
    const result = calculateIntervalDay(interval);

    expect(result.start).toEqual(new Date('2023-01-01T00:00:00'));
    expect(result.end).toEqual(new Date('2023-01-03T00:00:00'));

    expect(interval).toEqual(originalInterval);
  });

  it('should handle cases where the interval is already aligned to days', () => {
    const interval: Interval = {
      start: new Date('2023-01-01T00:00:00'),
      end: new Date('2023-01-02T00:00:00'),
    };
    const result = calculateIntervalDay(interval);

    expect(result.start).toEqual(new Date('2023-01-01T00:00:00'));
    expect(result.end).toEqual(new Date('2023-01-02T00:00:00'));
  });
});

describe('intervalDaysOverlap', () => {
  it('should return true when intervals overlap by sharing a day', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T14:00:00'),
      end: new Date('2023-01-02T03:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02T14:00:00'),
      end: new Date('2023-01-03T03:00:00'),
    };
    expect(intervalDaysOverlap(interval1, interval2)).toBe(true);
  });

  it('should return false when intervals do not overlap by sharing a day', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T14:00:00'),
      end: new Date('2023-01-02T03:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-03T14:00:00'),
      end: new Date('2023-01-04T03:00:00'),
    };
    expect(intervalDaysOverlap(interval1, interval2)).toBe(false);
  });

  it('should return true when intervals share the same day', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T00:00:00'),
      end: new Date('2023-01-01T23:59:59'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-01T14:00:00'),
      end: new Date('2023-01-01T18:00:00'),
    };
    expect(intervalDaysOverlap(interval1, interval2)).toBe(true);
  });

  it('should return false when intervals touch but do not overlap by day', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T00:00:00'),
      end: new Date('2023-01-02T00:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02T00:00:00'),
      end: new Date('2023-01-03T00:00:00'),
    };
    expect(intervalDaysOverlap(interval1, interval2)).toBe(false);
  });
});

describe('intervalDayOverlapsWithAny', () => {
  it('should return true if the original interval overlaps with any of the provided intervals', () => {
    const original: Interval = {
      start: new Date('2023-01-01T14:00:00'),
      end: new Date('2023-01-02T03:00:00'),
    };
    const interval1: Interval = {
      start: new Date('2023-01-02T14:00:00'),
      end: new Date('2023-01-03T03:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-03T14:00:00'),
      end: new Date('2023-01-04T03:00:00'),
    };
    expect(intervalDayOverlapsWithAny(original, interval1, interval2)).toBe(
      true,
    );
  });

  it('should return false if the original interval does not overlap with any of the provided intervals', () => {
    const original: Interval = {
      start: new Date('2023-01-01T14:00:00'),
      end: new Date('2023-01-02T03:00:00'),
    };
    const interval1: Interval = {
      start: new Date('2023-01-03T14:00:00'),
      end: new Date('2023-01-04T03:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-04T14:00:00'),
      end: new Date('2023-01-05T03:00:00'),
    };
    expect(intervalDayOverlapsWithAny(original, interval1, interval2)).toBe(
      false,
    );
  });
});

describe('adjustIntervalDay', () => {
  it('should adjust the interval day to fit within the reference interval', () => {
    const referenceInterval: Interval = {
      start: new Date('2023-01-01T00:00:00'),
      end: new Date('2023-01-05T00:00:00'),
    };
    const targetInterval: Interval = {
      start: new Date('2023-01-02T00:00:00'),
      end: new Date('2023-01-06T00:00:00'),
    };
    const adjustedInterval = adjustIntervalDay(
      referenceInterval,
      targetInterval,
    );

    expect(adjustedInterval.start).toEqual(new Date('2023-01-02T00:00:00'));
    expect(adjustedInterval.end).toEqual(new Date('2023-01-05T00:00:00'));
  });

  it('should return a new interval and not mutate the original interval', () => {
    const referenceInterval: Interval = {
      start: new Date('2023-01-01T00:00:00'),
      end: new Date('2023-01-05T00:00:00'),
    };
    const targetInterval: Interval = {
      start: new Date('2023-01-02T00:00:00'),
      end: new Date('2023-01-06T00:00:00'),
    };
    const adjustedInterval = adjustIntervalDay(
      referenceInterval,
      targetInterval,
    );

    expect(adjustedInterval).not.toBe(targetInterval);
    expect(adjustedInterval.start).not.toBe(targetInterval.start);
    expect(adjustedInterval.end).not.toBe(targetInterval.end);
    expect(targetInterval.start).toEqual(new Date('2023-01-02T00:00:00'));
    expect(targetInterval.end).toEqual(new Date('2023-01-06T00:00:00'));
  });
});

describe('calculateDaysDuration', () => {
  it('should correctly calculate the duration in days', () => {
    const startDate = new Date('2023-01-01T00:00:00');
    const endDate = new Date('2023-01-03T00:00:00');
    const duration = calculateDaysDuration(startDate, endDate);
    expect(duration).toBe(2); // 2 days
  });

  it('should return 0 if the start and end times are the same day', () => {
    const startDate = new Date('2023-01-01T00:00:00');
    const endDate = new Date('2023-01-01T00:00:00');
    const duration = calculateDaysDuration(startDate, endDate);
    expect(duration).toBe(0);
  });
});
