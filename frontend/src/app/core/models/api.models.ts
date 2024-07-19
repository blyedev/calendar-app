export interface CalendarAPIMessage {
  name: string;
  description?: string;
}

export interface CalendarAPIResponse {
  user: number;
  uid: string;

  name: string;
  description?: string;

  dtstamp: string;
  last_modified: string;
}

export interface CalendarEventAPIMessage {
  calendar: string;

  summary: string;
  description?: string;
  dtstart: string;
  dtend: string;

  rrule?: RecurrenceRuleAPIResponse | null;
}

export interface CalendarEventAPIResponse {
  calendar: string;
  uid: string;

  summary: string;
  description?: string;
  dtstart: string;
  dtend: string;

  dtstamp: string;
  last_modified: string;
  rrule?: RecurrenceRuleAPIResponse | null;
}

export interface RecurrenceRuleAPIResponse {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number | null;
  count?: number | null;
  until?: string | null;
}
