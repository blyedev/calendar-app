import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CalendarEvent } from 'src/app/core/models/calendar.models';
import { CalendarEventAPIService } from 'src/app/core/services/calendar-event-api.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject: BehaviorSubject<CalendarEvent[]>;
  private singularEventSubject: BehaviorSubject<CalendarEvent | null>;

  private _events$: Observable<CalendarEvent[]>;

  constructor(private calendarEventAPIService: CalendarEventAPIService) {
    this.eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
    this.singularEventSubject = new BehaviorSubject<CalendarEvent | null>(null);

    this._events$ = combineLatest([
      this.eventsSubject.asObservable(),
      this.singularEventSubject.asObservable(),
    ]).pipe(
      map(([events, singularEvent]) => {
        if (singularEvent) {
          return [...events, singularEvent];
        }
        return events;
      }),
    );

    this.loadEvents();
  }

  public get events$(): Observable<CalendarEvent[]> {
    return this._events$;
  }

  loadEvents(calendarUIDs?: string[]): void {
    this.calendarEventAPIService
      .getEvents(calendarUIDs)
      .pipe(tap((events: CalendarEvent[]) => this.eventsSubject.next(events)))
      .subscribe();
  }

  addEvent(event: CalendarEvent): void {
    this.calendarEventAPIService
      .addEvent(event)
      .pipe(tap(() => this.loadEvents()))
      .subscribe();
  }

  updateEvent(event: CalendarEvent): void {
    this.calendarEventAPIService
      .updateEvent(event)
      .pipe(tap(() => this.loadEvents()))
      .subscribe();
  }

  deleteEvent(uid: string): void {
    this.calendarEventAPIService
      .deleteEvent(uid)
      .pipe(tap(() => this.loadEvents()))
      .subscribe();
  }

  addSingularEvent(event: CalendarEvent): void {
    this.singularEventSubject.next(event);
  }

  removeSingularEvent(): void {
    this.singularEventSubject.next(null);
  }
}
