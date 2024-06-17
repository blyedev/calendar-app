import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from 'src/app/core/models/calendar-event';
import { CalendarEventService } from 'src/app/core/services/calendar-event-service/calendar-event.service';

@Injectable()
export class EventCreationService {

  private createdEventSubject$: BehaviorSubject<CalendarEvent | undefined> = new BehaviorSubject<CalendarEvent | undefined>(undefined);

  constructor(
    private calendarEventService: CalendarEventService
  ) { }

  getSubject(): BehaviorSubject<CalendarEvent | undefined> {
    return this.createdEventSubject$;
  }

  startCreating(tempEvent: CalendarEvent) {
    this.createdEventSubject$.next(tempEvent);
  }

  finalizeCreating(newEvent: CalendarEvent) {
    this.calendarEventService.createEvent(newEvent).subscribe(createdEvent => {
      console.log('Created Event:', createdEvent);
      this.calendarEventService.refreshEvents();
    });

    this.createdEventSubject$.next(undefined)
  }

  abortCreating() {
    this.createdEventSubject$.next(undefined)
  }
}
