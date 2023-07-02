import { Injectable } from '@angular/core';
import { CalendarEventImpl } from './calendar-event-implementation';
import { CalendarEvent } from './calendar-event';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  getArrayOfObjects(): {
    dayOfWeek: string;
    id: number;
    events: CalendarEvent[]; // Use CalendarEventImpl instead of CalendarEvent
  }[] {
    return [
      {
        dayOfWeek: "Monday",
        id: 1,
        events: [
          new CalendarEventImpl(1, "Event 1"),
          new CalendarEventImpl(2, "Event 2")
        ]
      },
      {
        dayOfWeek: "Tuesday",
        id: 2,
        events: [
          new CalendarEventImpl(3, "Event 3")
        ]
      },
      {
        dayOfWeek: "Wednesday",
        id: 3,
        events: [
          new CalendarEventImpl(4, "Event 4"),
          new CalendarEventImpl(5, "Event 5")
        ]
      },
      {
        dayOfWeek: "Thursday",
        id: 4,
        events: [
          new CalendarEventImpl(6, "Event 6"),
          new CalendarEventImpl(7, "Event 7")
        ]
      },
      {
        dayOfWeek: "Friday",
        id: 5,
        events: [
          new CalendarEventImpl(8, "Event 8")
        ]
      },
      {
        dayOfWeek: "Saturday",
        id: 6,
        events: [
          new CalendarEventImpl(9, "Event 9"),
          new CalendarEventImpl(10, "Event 10")
        ]
      },
      {
        dayOfWeek: "Sunday",
        id: 7,
        events: [
          new CalendarEventImpl(11, "Event 11")
        ]
      }
    ];
  }
}
