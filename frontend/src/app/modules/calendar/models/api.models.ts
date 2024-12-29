interface CalendarObjectBase {
  uid: string;

  dtstamp: string;
  last_modified: string;
}

export interface CalendarRequest {
  name: string;
  description?: string;
}

export interface CalendarResponse extends CalendarObjectBase, CalendarRequest {
  user: number;
}

export interface CalendarEventRequest {
  calendar: string;

  summary: string;
  description?: string;
  dtstart: string;
  dtend: string;

  rrule?: RecurrenceRule | null;
}

export interface CalendarEventResponse
  extends CalendarObjectBase,
    CalendarEventRequest {}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number | null;
  count?: number | null;
  until?: string | null;
}
