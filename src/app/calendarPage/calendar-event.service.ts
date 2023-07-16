import { Injectable } from '@angular/core';
import { CalendarEventImpl } from './calendar-event-implementation';
import { CalendarEvent } from './calendar-event';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  events: CalendarEvent[];

  constructor () {
    this.events = this.generateEvents(30)
  }

  private generateEvents(count: number): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    for (let i = 1; i <= count; i++) {
      const event = new CalendarEventImpl(i);
      events.push(event);
    }

    return events;
  }

  getAllSameDayEvents(): Observable<CalendarEvent[]> {
    const filteredEvents = this.events.filter(event => {
      return event.startDateTime.toDateString() === event.endDateTime.toDateString();
    });
  
    return of(filteredEvents);
  }
  
}
