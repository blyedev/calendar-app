import { Injectable, Signal, computed, signal } from '@angular/core';
import { CalendarEvent } from '../models/calendar.models';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from 'src/app/core/services/logging.service';
import {
  CalendarEventRequest,
  CalendarEventResponse,
} from '../models/api.models';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = new URL(environment.apiUrl, window.location.origin);

  private eventsSignal = signal<CalendarEvent[]>([]);
  private mixinEventSignal = signal<CalendarEvent | null>(null);

  public readonly events: Signal<CalendarEvent[]> = computed(() => {
    const mixin = this.mixinEventSignal();
    if (mixin === null) {
      return this.eventsSignal();
    }
    return [...this.eventsSignal(), mixin];
  });

  constructor(
    private http: HttpClient,
    private logger: LoggingService,
  ) {
    this.getEvents();
  }

  setMixinEvent(event: CalendarEvent): void {
    this.mixinEventSignal.set(event);
  }

  removeMixinEvent(): void {
    this.mixinEventSignal.set(null);
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    const url = new URL('v1/events/', this.apiUrl);
    return this.http
      .post<CalendarEventResponse>(
        url.pathname,
        this.serializeCalendarEvent(event),
        { observe: 'response' },
      )
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return this.deserializeCalendarEvent(response.body!);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap(() => this.getEvents()),
      );
  }

  getEvents(): Observable<CalendarEvent[]> {
    const url = new URL('v1/events/', this.apiUrl);
    return this.http
      .get<
        readonly CalendarEventResponse[]
      >(url.pathname, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.body!.map(this.deserializeCalendarEvent);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap((calendars) => this.eventsSignal.set(calendars)),
      );
  }

  getEvent(uid: string): Observable<CalendarEvent> {
    const url = new URL('v1/events/' + uid + '/', this.apiUrl);
    return this.http
      .get<CalendarEventResponse>(url.pathname, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return this.deserializeCalendarEvent(response.body!);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
      );
  }
  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    if (!event.uid) {
      const error = new Error('UUID missing on request');
      this.logger.error(error);
      throw error;
    }

    const url = new URL('v1/events/' + event.uid + '/', this.apiUrl);
    return this.http
      .patch<CalendarEventResponse>(
        url.pathname,
        this.serializeCalendarEvent(event),
        { observe: 'response' },
      )
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return this.deserializeCalendarEvent(response.body!);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap(() => this.getEvents()),
      );
  }

  deleteEvent(uid: string): Observable<null> {
    const url = new URL('v1/events/' + uid + '/', this.apiUrl);
    return this.http.delete<null>(url.pathname, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status === 204) {
          return null;
        }
        throw new Error('Unexpected 2XX status code');
      }),
      catchError((error: HttpErrorResponse) => {
        this.logger.error('Unexpected 4XX or 5XX status code');
        throw error;
      }),
      tap(() => this.getEvents()),
    );
  }

  private deserializeCalendarEvent(
    response: CalendarEventResponse,
  ): CalendarEvent {
    return {
      calendarUID: response.calendar,
      uid: response.uid,

      summary: response.summary,
      description: response.description,
      start: new Date(response.dtstart),
      end: new Date(response.dtend),
      recurrenceRule: null,

      createdAt: new Date(response.dtstamp),
      lastModified: new Date(response.last_modified),
    };
  }

  private serializeCalendarEvent(event: CalendarEvent): CalendarEventRequest {
    return {
      calendar: event.calendarUID,

      summary: event.summary,
      description: event.description,
      dtstart: event.start.toISOString(),
      dtend: event.end.toISOString(),

      rrule: null,
    };
  }
}
