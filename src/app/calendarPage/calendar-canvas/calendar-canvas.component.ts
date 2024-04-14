import { Component } from '@angular/core';
import { CalendarEvent } from '../calendar-event';
import { CalendarEventService } from '../calendar-event-service/calendar-event.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DayBounds, DayContainer } from '../day-column/day-container';

@Component({
  selector: 'app-calendar-canvas',
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css']
})
export class CalendarCanvasComponent {
  private eventSubject$: BehaviorSubject<CalendarEvent[]>;

  shortEventsByDay: DayContainer[] = [];
  fullDayEvents: CalendarEvent[] = [];

  constructor(calendarEventService: CalendarEventService) {
    this.eventSubject$ = calendarEventService.getEventsSubject();
    calendarEventService.refreshEvents()

    this.eventSubject$.subscribe((events: CalendarEvent[]) => {
      const newShortEvents = [];

      for (let i = 0; i < 7; i++) {
        newShortEvents.push(this.getDayContainer(events, this.getDayBounds(new Date, i)));
      }

      this.shortEventsByDay = newShortEvents;
      this.fullDayEvents = this.getFullDayEvents(events);
    })
  }


  private getFullDayEvents(events: CalendarEvent[] | null): CalendarEvent[] {
    if (!events) {
      return [];
    }

    return events.filter((event) => {
      const unixDay = 1000 * 60 * 60 * 24;
      const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
      return Math.floor(unixDaySpan / unixDay) >= 1;
    });
  }

  private getDayContainer(events: CalendarEvent[] | null, dayBounds: DayBounds): DayContainer {
    if (!events) {
      return { dayBounds: dayBounds, events: [] };
    }

    const filteredEvents = events
      .filter((event) => {
        const unixDay = 1000 * 60 * 60 * 24;
        const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
        return Math.floor(unixDaySpan / unixDay) < 1;
      })
      .filter((event) => {
        return event.startDateTime.getTime() < dayBounds.dayEnd.getTime() && event.endDateTime.getTime() > dayBounds.dayStart.getTime();
      });

    return { dayBounds: dayBounds, events: filteredEvents }
  }


  private getDayBounds(currentDate: Date, dayIndex: number): { dayStart: Date, dayEnd: Date } {
    const currentWeekStart = new Date(currentDate);
    const mondayOffset = currentWeekStart.getDay() > 0 ? currentWeekStart.getDay() - 1 : 6;
    currentWeekStart.setDate(currentWeekStart.getDate() - mondayOffset);
    currentWeekStart.setHours(0, 0, 0, 0);

    // Create dayStart and dayEnd based on the given dayIndex
    const dayStart = new Date(currentWeekStart);
    dayStart.setDate(dayStart.getDate() + dayIndex);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return { dayStart, dayEnd };
  }

}
