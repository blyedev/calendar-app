import { Injectable } from '@angular/core';
import { CalendarEventImpl } from './calendar-event-implementation';
import { CalendarEvent } from './calendar-event';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private arrayOfObjects: {
    dayOfWeek: string;
    id: number;
    events: CalendarEvent[]; // Use CalendarEventImpl instead of CalendarEvent
  }[] = [
      {
        dayOfWeek: "Monday",
        id: 1,
        events: [
          new CalendarEventImpl(1, "Event 1"),
          new CalendarEventImpl(2, "Event 1"),
          new CalendarEventImpl(3, "Event 1"),
          new CalendarEventImpl(4, "Event 2")
        ]
      },
      {
        dayOfWeek: "Tuesday",
        id: 2,
        events: [
          new CalendarEventImpl(5, "Event 1"),
          new CalendarEventImpl(6, "Event 1"),
          new CalendarEventImpl(7, "Event 1"),
          new CalendarEventImpl(8, "Event 1"),
          new CalendarEventImpl(9, "Event 3")
        ]
      },
      {
        dayOfWeek: "Wednesday",
        id: 3,
        events: [
          new CalendarEventImpl(10, "Event 1"),
          new CalendarEventImpl(11, "Event 1"),
          new CalendarEventImpl(12, "Event 4"),
          new CalendarEventImpl(13, "Event 5")
        ]
      },
      {
        dayOfWeek: "Thursday",
        id: 4,
        events: [
          new CalendarEventImpl(14, "Event 1"),
          new CalendarEventImpl(15, "Event 1"),
          new CalendarEventImpl(16, "Event 1"),
          new CalendarEventImpl(17, "Event 6"),
          new CalendarEventImpl(18, "Event 7")
        ]
      },
      {
        dayOfWeek: "Friday",
        id: 5,
        events: [
          new CalendarEventImpl(19, "Event 1"),
          new CalendarEventImpl(20, "Event 1"),
          new CalendarEventImpl(21, "Event 8")
        ]
      },
      {
        dayOfWeek: "Saturday",
        id: 6,
        events: [
          new CalendarEventImpl(22, "Event 1"),
          new CalendarEventImpl(23, "Event 1"),
          new CalendarEventImpl(24, "Event 9"),
          new CalendarEventImpl(25, "Event 10")
        ]
      },
      {
        dayOfWeek: "Sunday",
        id: 7,
        events: [
          new CalendarEventImpl(26, "Event 1"),
          new CalendarEventImpl(27, "Event 1"),
          new CalendarEventImpl(28, "Event 1"),
          new CalendarEventImpl(29, "Event 1"),
          new CalendarEventImpl(30, "Event 11")
        ]
      }
    ];

  private sortEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.sort((a, b) => {
      if (a.startDateTime < b.startDateTime) {
        return -1;
      } else if (a.startDateTime > b.startDateTime) {
        return 1;
      } else {
        if (a.endDateTime < b.endDateTime) {
          return -1;
        } else if (a.endDateTime > b.endDateTime) {
          return 1;
        } else {
          return a.id - b.id;
        }
      }
    });
  }

  getArrayOfObjects(): {
    dayOfWeek: string;
    id: number;
    events: CalendarEvent[];
  }[] {
    return this.arrayOfObjects;
  }

  getEventsByDayId(id: number): CalendarEvent[] | undefined {
    const day = this.arrayOfObjects.find(obj => obj.id === id);
    return day ? day.events : undefined;
  }

  getArrayOfObjectsWithSortedEvents(): { dayOfWeek: string; id: number; events: CalendarEvent[] }[] {
    const sortedArray = [...this.arrayOfObjects];

    sortedArray.forEach(obj => {
      obj.events = this.sortEvents(obj.events);
    });

    return sortedArray;
  }

  getSortedEventsByDayId(id: number): CalendarEvent[] | undefined {
    const day = this.arrayOfObjects.find(obj => obj.id === id);
    return day ? this.sortEvents(day.events) : undefined;
  }
}
