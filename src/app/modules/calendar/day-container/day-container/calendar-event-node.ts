import { CalendarEvent } from "src/app/core/models/calendar-event";

export class CalendarNode {
  constructor(
    public value: CalendarEvent,
    public topChildren: CalendarNode[] = [],
    public bottomChildren: CalendarNode[] = []
  ) { }
}
