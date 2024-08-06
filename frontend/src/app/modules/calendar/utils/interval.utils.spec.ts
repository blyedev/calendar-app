import { intervalsOverlap, intervalDaysOverlap } from './interval.utils';
import { Interval } from 'src/app/core/models/calendar.models';

describe('intervalsOverlap', () => {
  it('should return false when no intervals are provided', () => {
    expect(intervalsOverlap()).toBe(false);
  });

  it('should return false when only one interval is provided', () => {
    const interval: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
    };
    expect(intervalsOverlap(interval)).toBe(false);
  });

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

  it('should return true when multiple intervals overlap', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-03'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02'),
      end: new Date('2023-01-04'),
    };
    const interval3: Interval = {
      start: new Date('2023-01-03'),
      end: new Date('2023-01-05'),
    };
    expect(intervalsOverlap(interval1, interval2, interval3)).toBe(true);
  });

  it('should return false when no intervals overlap among multiple intervals', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-03'),
      end: new Date('2023-01-04'),
    };
    const interval3: Interval = {
      start: new Date('2023-01-05'),
      end: new Date('2023-01-06'),
    };
    expect(intervalsOverlap(interval1, interval2, interval3)).toBe(false);
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

  it('should return false when one interval starts at the exact end of another', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T00:00:00'),
      end: new Date('2023-01-02T00:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02T00:00:00'),
      end: new Date('2023-01-03T00:00:00'),
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

describe('intervalDaysOverlap', () => {
  it('should return false when no intervals are provided', () => {
    expect(intervalDaysOverlap()).toBe(false);
  });

  it('should return false when only one interval is provided', () => {
    const interval: Interval = {
      start: new Date('2023-01-01T14:00:00'),
      end: new Date('2023-01-02T03:00:00'),
    };
    expect(intervalDaysOverlap(interval)).toBe(false);
  });

  it('should return true when intervals overlap by sharing a day', () => {
    const interval1: Interval = {
      start: new Date('2019-02-19T14:00:00'),
      end: new Date('2019-02-20T03:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2019-02-20T14:00:00'),
      end: new Date('2019-02-21T03:00:00'),
    };
    expect(intervalDaysOverlap(interval1, interval2)).toBe(true);
  });

  it('should return false when intervals do not overlap by sharing a day', () => {
    const interval1: Interval = {
      start: new Date('2019-02-19T14:00:00'),
      end: new Date('2019-02-21T00:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2019-02-22T14:00:00'),
      end: new Date('2019-02-23T03:00:00'),
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

  it('should return true when one interval starts during another interval on the same day', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T10:00:00'),
      end: new Date('2023-01-02T10:00:00'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-01T20:00:00'),
      end: new Date('2023-01-03T10:00:00'),
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

  it('should return true when intervals overlap by one millisecond spanning days', () => {
    const interval1: Interval = {
      start: new Date('2023-01-01T23:59:59.999Z'),
      end: new Date('2023-01-02T23:59:59.999Z'),
    };
    const interval2: Interval = {
      start: new Date('2023-01-02T00:00:00.000Z'),
      end: new Date('2023-01-03T00:00:00.000Z'),
    };
    expect(intervalDaysOverlap(interval1, interval2)).toBe(true);
  });
});
