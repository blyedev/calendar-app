import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CalendarEvent } from '../models/calendar.models';
import {
  CalendarEventAPIMessage,
  CalendarEventAPIResponse,
} from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class CalendarEventAPIService {
  private apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    const endpoint = `${this.apiUrl}/`;

    return this.http
      .post<CalendarEventAPIResponse>(
        endpoint,
        this.calendarEventToMessage(event),
      )
      .pipe(map(this.calendarEventFromResponse));
  }

  getEvents(calendarUIDs?: string[]): Observable<CalendarEvent[]> {
    const endpoint = `${this.apiUrl}/`;
    let params = new HttpParams();

    if (calendarUIDs && calendarUIDs.length > 0) {
      const calendarParam = calendarUIDs.join(',');
      params = params.set('calendar', calendarParam);
    }

    return this.http
      .get<CalendarEventAPIResponse[]>(endpoint, { params: params })
      .pipe(map((data) => data.map(this.calendarEventFromResponse)));
  }

  getEvent(uid: string): Observable<CalendarEvent> {
    const endpoint = `${this.apiUrl}/${uid}/`;

    return this.http
      .get<CalendarEventAPIResponse>(endpoint)
      .pipe(map(this.calendarEventFromResponse));
  }

  updateEvent(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    const endpoint = `${this.apiUrl}/${calendarEvent.uid}/`;

    return this.http
      .put<CalendarEventAPIResponse>(
        endpoint,
        this.calendarEventToMessage(calendarEvent),
      )
      .pipe(map(this.calendarEventFromResponse));
  }

  deleteEvent(uid: string): Observable<void> {
    const endpoint = `${this.apiUrl}/${uid}/`;

    return this.http.delete<void>(endpoint);
  }

  private calendarEventFromResponse(
    apiResponse: CalendarEventAPIResponse,
  ): CalendarEvent {
    return {
      calendarUID: apiResponse.calendar,
      uid: apiResponse.uid,

      summary: apiResponse.summary,
      description: apiResponse.description,
      eventStart: new Date(apiResponse.dtstart),
      eventEnd: new Date(apiResponse.dtend),
      recurrenceRule: null,

      createdAt: new Date(apiResponse.dtstamp),
      lastModified: new Date(apiResponse.last_modified),
    };
  }

  private calendarEventToMessage(
    calendarEvent: CalendarEvent,
  ): CalendarEventAPIMessage {
    return {
      calendar: calendarEvent.calendarUID,

      summary: calendarEvent.summary,
      description: calendarEvent.description,
      dtstart: calendarEvent.eventStart.toISOString(),
      dtend: calendarEvent.eventEnd.toISOString(),

      rrule: null,
    };
  }
}
