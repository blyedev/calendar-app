export interface Calendar {
  user?: number;
  uid?: string;

  name: string;
  description?: string;

  createdAt?: Date;
  lastModified?: Date;
}

export interface CalendarEvent {
  calendarUID?: string;
  uid?: string;

  summary: string;
  description?: string;
  eventStart: Date;
  eventEnd: Date;
  recurrenceRule?: RecurrenceRule;

  createdAt?: Date;
  lastModified?: Date;
}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  count?: number;
  until?: Date;
}
