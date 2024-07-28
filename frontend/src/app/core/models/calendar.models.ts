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

export interface CalendarEvent extends CalendarObjectBase {
  readonly calendarUID: string;

  readonly summary: string;
  readonly description?: string;
  readonly eventStart: Date;
  readonly eventEnd: Date;
  readonly recurrenceRule?: RecurrenceRule | null;
}

export interface RecurrenceRule {
  readonly frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  readonly interval?: number;
  readonly count?: number;
  readonly until?: Date;
}

export interface TimeSpan {
  readonly start: Date;
  readonly end: Date;
}
