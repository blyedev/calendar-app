import { computed, inject, Injectable } from '@angular/core';
import { EventService } from './event.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CalendarService } from './calendar.service';
import { Calendar, CalendarEvent, Interval } from '../models/calendar.models';

@Injectable({
  providedIn: 'root',
})
export class EventCreationService {
  private readonly eventService = inject(EventService);
  private readonly calendarService = inject(CalendarService);
  private defaultCalendar: Calendar;
  private readonly createdEvent: BehaviorSubject<CalendarEvent | null>;

  constructor() {
    this.createdEvent = new BehaviorSubject<CalendarEvent | null>(null);
    this.defaultCalendar = computed(() => this.calendarService.calendars()[0]!);
  }

  initCreating(timespan: Interval): void {
    const newEvent: CalendarEvent = {
      calendarUID: this.defaultCalendar.uid!,
      summary: '(Untitled)',
      ...timespan,
    };

    this.eventService.setMixinEvent(newEvent);
  }

  abortCreating(): void {
    this.eventService.removeMixinEvent();
  }
}
