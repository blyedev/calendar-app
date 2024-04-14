import { CalendarEvent } from "../calendar-event";

export interface DayBounds {
  dayStart: Date,
  dayEnd: Date
}

export interface DayContainer {
  dayBounds: DayBounds,
  events: CalendarEvent[]
}
