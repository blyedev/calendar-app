interface CalendarObjectBase {
  readonly uid?: string;

  readonly createdAt?: Date;
  readonly lastModified?: Date;
}

export interface Calendar extends CalendarObjectBase {
  readonly user?: number;

  readonly name: string;
  readonly description?: string;
}

export interface CalendarEvent extends CalendarObjectBase, Interval {
  readonly calendarUID: string;

  readonly summary: string;
  readonly description?: string;
  readonly recurrenceRule?: RecurrenceRule | null;
}

export interface RecurrenceRule {
  readonly frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  readonly interval?: number;
  readonly count?: number;
  readonly until?: Date;
}

/**
 * Represents an interval with a start and end date.
 * The interval includes the start date (inclusive) but excludes the end date (exclusive).
 *
 * @interface Interval
 * @property {Date} start - The start date of the interval (inclusive).
 * @property {Date} end - The end date of the interval (exclusive).
 */
export interface Interval {
  readonly start: Date;
  readonly end: Date;
}
