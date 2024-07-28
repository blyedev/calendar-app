interface CalendarObjectBase {
  uid: string;

  dtstamp: string;
  last_modified: string;
}

export interface CalendarAPIMessage {
  name: string;
  description?: string;
}

export interface CalendarAPIResponse
  extends CalendarObjectBase,
    CalendarAPIMessage {
  user: number;
}

export interface CalendarEventAPIMessage {
  calendar: string;

  summary: string;
  description?: string;
  dtstart: string;
  dtend: string;

  rrule?: RecurrenceRuleAPIResponse | null;
}

export interface CalendarEventAPIResponse
  extends CalendarObjectBase,
    CalendarEventAPIMessage {}

export interface RecurrenceRuleAPIResponse {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number | null;
  count?: number | null;
  until?: string | null;
}
