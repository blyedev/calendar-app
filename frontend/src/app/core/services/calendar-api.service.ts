import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Calendar } from '../models/calendar.models';
import { CalendarAPIMessage, CalendarAPIResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class CalendarAPIService {
  private apiUrl = environment.apiUrl + '/calendars';

  constructor(private http: HttpClient) {}

  addCalendar(calendar: Calendar): Observable<Calendar> {
    const endpoint = `${this.apiUrl}/`;

    return this.http
      .put<CalendarAPIResponse>(endpoint, this.calendarToMessage(calendar))
      .pipe(map(this.calendarFromResponse));
  }

  getCalendars(): Observable<Calendar[]> {
    const endpoint = `${this.apiUrl}/`;

    return this.http
      .get<CalendarAPIResponse[]>(endpoint)
      .pipe(map((data) => data.map(this.calendarFromResponse)));
  }

  getCalendar(uid: string): Observable<Calendar> {
    const endpoint = `${this.apiUrl}/${uid}/`;

    return this.http
      .get<CalendarAPIResponse>(endpoint)
      .pipe(map(this.calendarFromResponse));
  }

  updateCalendar(calendar: Calendar): Observable<Calendar> {
    const endpoint = `${this.apiUrl}/${calendar.uid}/`;

    return this.http
      .patch<CalendarAPIResponse>(endpoint, this.calendarToMessage(calendar))
      .pipe(map(this.calendarFromResponse));
  }

  deleteCalendar(uid: string): Observable<Calendar> {
    const endpoint = `${this.apiUrl}/${uid}/`;

    return this.http
      .delete<CalendarAPIResponse>(endpoint)
      .pipe(map(this.calendarFromResponse));
  }

  private calendarFromResponse(apiResponse: CalendarAPIResponse): Calendar {
    return {
      user: apiResponse.user,
      uid: apiResponse.uid,
      name: apiResponse.name,
      description: apiResponse.description,
      createdAt: new Date(apiResponse.dtstamp),
      lastModified: new Date(apiResponse.last_modified),
    };
  }

  private calendarToMessage(calendar: Calendar): CalendarAPIMessage {
    return {
      name: calendar.name,
      description: calendar.description,
    };
  }
}
