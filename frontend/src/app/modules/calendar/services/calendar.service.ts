import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Calendar } from '../models/calendar.models';
import { CalendarRequest, CalendarResponse } from '../models/api.models';
import { catchError, map, Observable, tap } from 'rxjs';
import { LoggingService } from 'src/app/core/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl = new URL(environment.apiUrl, window.location.origin);

  private calendarsSignal = signal<Calendar[]>([]);
  public readonly calendars = this.calendarsSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private logger: LoggingService,
  ) {
    this.getCalendars().subscribe();
  }

  createCalendar(calendar: Calendar): Observable<Calendar> {
    const url = new URL('v1/calendars/', this.apiUrl);
    return this.http
      .post<CalendarResponse>(url.pathname, this.serializeCalendar(calendar), {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return this.deserializeCalendar(response.body!);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap(() => this.getCalendars()),
      );
  }

  getCalendars(): Observable<Calendar[]> {
    const url = new URL('v1/calendars/', this.apiUrl);
    return this.http
      .get<readonly CalendarResponse[]>(url.pathname, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.body!.map(this.deserializeCalendar);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap((calendars) => this.calendarsSignal.set(calendars)),
      );
  }

  getCalendar(uid: string): Observable<Calendar> {
    const url = new URL('v1/calendars/' + uid + '/', this.apiUrl);
    return this.http
      .get<CalendarResponse>(url.pathname, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return this.deserializeCalendar(response.body!);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
      );
  }

  updateCalendar(calendar: Calendar): Observable<Calendar> {
    if (!calendar.uid) {
      const error = new Error('UUID missing on request');
      this.logger.error(error);
      throw error;
    }

    const url = new URL('v1/calendars/' + calendar.uid + '/', this.apiUrl);
    return this.http
      .patch<CalendarResponse>(url.pathname, this.serializeCalendar(calendar), {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return this.deserializeCalendar(response.body!);
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap(() => this.getCalendars()),
      );
  }

  deleteCalendar(uid: string): Observable<null> {
    const url = new URL('v1/calendars/' + uid + '/', this.apiUrl);
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
      tap(() => this.getCalendars()),
    );
  }

  private deserializeCalendar(response: CalendarResponse): Calendar {
    return {
      user: response.user,
      uid: response.uid,
      name: response.name,
      description: response.description,
      createdAt: new Date(response.dtstamp),
      lastModified: new Date(response.last_modified),
    };
  }

  private serializeCalendar(calendar: Calendar): CalendarRequest {
    return {
      name: calendar.name,
      description: calendar.description,
    };
  }
}
