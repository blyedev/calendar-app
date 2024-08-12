import { Injectable, Signal, computed, signal } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar.models';
import { CalendarEventAPIService } from 'src/app/core/services/calendar-event-api.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSignal = signal<CalendarEvent[]>([]);
  private mixinEventSignal = signal<CalendarEvent | null>(null);

  readonly events: Signal<CalendarEvent[]> = computed(() => {
    const events = this.eventsSignal();
    const mixinEvent = this.mixinEventSignal();

    if (mixinEvent) {
      return [...events, mixinEvent];
    }
    return events;
  });

  constructor(private calendarEventAPIService: CalendarEventAPIService) {
    this.loadEvents();
  }

  loadEvents(calendarUIDs?: string[]): void {
    this.calendarEventAPIService
      .getEvents(calendarUIDs)
      .subscribe((events: CalendarEvent[]) => {
        this.eventsSignal.set(events);
      });
  }

  addEvent(event: CalendarEvent): void {
    this.calendarEventAPIService
      .addEvent(event)
      .subscribe(() => this.loadEvents());
  }

  updateEvent(event: CalendarEvent): void {
    this.calendarEventAPIService
      .updateEvent(event)
      .subscribe(() => this.loadEvents());
  }

  deleteEvent(uid: string): void {
    this.calendarEventAPIService
      .deleteEvent(uid)
      .subscribe(() => this.loadEvents());
  }

  setMixinEvent(event: CalendarEvent): void {
    this.mixinEventSignal.set(event);
  }

  removeMixinEvent(): void {
    this.mixinEventSignal.set(null);
  }
}
