import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Calendar, CalendarEvent } from 'src/app/core/models/calendar.models';
import { CalendarAPIService } from 'src/app/core/services/calendar-api.service';
import { CalendarEventAPIService } from 'src/app/core/services/calendar-event-api.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarDataService {
  private calendarsSubject: BehaviorSubject<Calendar[]>;
  private eventsSubject: BehaviorSubject<CalendarEvent[]>;
  private selectedCalendarsSubject: BehaviorSubject<Calendar[]>;

  private _calendars$: Observable<Calendar[]>;
  private _events$: Observable<CalendarEvent[]>;
  private _selectedCalendars$: Observable<Calendar[]>;

  constructor(
    private calendarAPIService: CalendarAPIService,
    private calendarEventAPIService: CalendarEventAPIService,
  ) {
    // create the data stores
    this.calendarsSubject = new BehaviorSubject<Calendar[]>([]);
    this.eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
    this.selectedCalendarsSubject = new BehaviorSubject<Calendar[]>([]);

    // create publicly gettable observables from the subjects
    this._calendars$ = this.calendarsSubject.asObservable();
    this._events$ = this.eventsSubject.asObservable();
    this._selectedCalendars$ = this.selectedCalendarsSubject.asObservable();

    // initiate asynchronous population of data stores
    this.loadCalendars();
    this.loadEvents();
  }

  public get calendars$(): Observable<Calendar[]> {
    return this._calendars$;
  }

  public get events$(): Observable<CalendarEvent[]> {
    return this._events$;
  }

  public get selectedCalendars$(): Observable<Calendar[]> {
    return this._selectedCalendars$;
  }

  loadCalendars(): void {
    this.calendarAPIService
      .getCalendars()
      .pipe(
        tap((calendars: Calendar[]) => {
          return this.calendarsSubject.next(calendars);
        }),
      )
      .subscribe();
  }

  loadEvents(calendarUIDs?: string[]): void {
    this.calendarEventAPIService
      .getEvents(calendarUIDs)
      .pipe(
        tap((events: CalendarEvent[]) => {
          return this.eventsSubject.next(events);
        }),
      )
      .subscribe();
  }

  addCalendar(calendar: Calendar): void {
    this.calendarAPIService
      .addCalendar(calendar)
      .pipe(
        tap(() => {
          return this.loadCalendars();
        }),
      )
      .subscribe();
  }

  updateCalendar(calendar: Calendar): void {
    this.calendarAPIService
      .updateCalendar(calendar)
      .pipe(
        tap(() => {
          return this.loadCalendars();
        }),
      )
      .subscribe();
  }

  deleteCalendar(uid: string): void {
    this.calendarAPIService
      .deleteCalendar(uid)
      .pipe(
        tap(() => {
          return this.loadCalendars();
        }),
      )
      .subscribe();
  }

  addEvent(event: CalendarEvent): void {
    this.calendarEventAPIService
      .addEvent(event)
      .pipe(
        tap(() => {
          return this.loadEvents();
        }),
      )
      .subscribe();
  }

  updateEvent(event: CalendarEvent): void {
    this.calendarEventAPIService
      .updateEvent(event)
      .pipe(
        tap(() => {
          return this.loadEvents();
        }),
      )
      .subscribe();
  }

  deleteEvent(uid: string): void {
    this.calendarEventAPIService
      .deleteEvent(uid)
      .pipe(
        tap(() => {
          return this.loadEvents();
        }),
      )
      .subscribe();
  }

  selectCalendars(calendars: Calendar[]): void {
    this.selectedCalendarsSubject.next(calendars);
    this.loadEvents(
      calendars.map((calendar: Calendar) => {
        return calendar.uid!;
      }),
    );
  }
}
