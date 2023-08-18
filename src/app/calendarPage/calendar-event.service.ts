import { Injectable } from '@angular/core';
import { RandomCalendarEvent } from './calendar-event-implementation';
import { CalendarEvent } from './calendar-event';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  events: CalendarEvent[];

  constructor() {
    this.events = [...this.generateEvents(20, true), ...this.generateEvents(3, false)];
  }

  private generateEvents(count: number, forceSameDay: boolean): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    for (let i = 1; i <= count; i++) {
      const event: CalendarEvent = new RandomCalendarEvent(i, undefined, undefined, undefined, forceSameDay);
      events.push(event);
    }

    return events;
  }

  getAllSameDayEvents(): Observable<CalendarEvent[]> {
    const filteredEvents = this.events.filter(event => {
      const followingMidnight = new Date(event.startDateTime)
      followingMidnight.setDate(followingMidnight.getDate() + 1)
      followingMidnight.setHours(0, 0, 0, 0)
      return event.startDateTime.toDateString() === event.endDateTime.toDateString() || event.endDateTime.getTime() == followingMidnight.getTime();
    }) || [];

    return of(filteredEvents);
  }

  getAllEvents(): Observable<CalendarEvent[]> {
    return of(this.events);
  }
}
