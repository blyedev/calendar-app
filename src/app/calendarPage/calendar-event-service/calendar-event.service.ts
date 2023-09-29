import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarEvent } from '../calendar-event';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventApiResponse } from './event-api-response';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private baseUrl = environment.apiUrl;
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);

  events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Fetch events when the service is initialized
    this.getAllEvents().subscribe({
      next: (events) => {
        this.eventsSubject.next(events);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  getAllEvents(): Observable<CalendarEvent[]> {
    const endpoint = 'events/';
    const apiUrl = `${this.baseUrl}${endpoint}`;

    return this.http.get<EventApiResponse[]>(apiUrl).pipe(
      map((data: EventApiResponse[]) => {
        const mappedData = data.map(item => ({
          id: item.id,
          name: item.title,
          startDateTime: new Date(item.event_start_datetime),
          endDateTime: new Date(item.event_end_datetime)
        }));

        console.log(mappedData);

        return mappedData;
      }),
      catchError((error) => {
        console.error('Error fetching events:', error);
        throw error;
      })
    );
  }

  createEvent(newEvent: CalendarEvent): Observable<CalendarEvent[]> {
    const endpoint = 'events/create/';
    const apiUrl = `${this.baseUrl}${endpoint}`;

    const newApiEvent = this.mapCalendarEventToApiRequest(newEvent);

    return this.http.post(apiUrl, newApiEvent).pipe(
      switchMap(() => this.getAllEvents()),
      tap((events) => this.eventsSubject.next(events)), // Emit updated events to the observable
      catchError((error) => {
        console.error('Error creating event:', error);
        throw error;
      })
    );
  }

  // private mapEventApiResponseToCalendarEvent(data: EventApiResponse[]): CalendarEvent[] {
  //   return data.map(item => ({
  //     id: item.id,
  //     name: item.title,
  //     startDateTime: new Date(item.event_start_datetime),
  //     endDateTime: new Date(item.event_end_datetime)
  //   }));
  // }

  private mapCalendarEventToApiRequest(event: CalendarEvent): any {
    // Map CalendarEvent properties to match the API request format
    return {
      title: event.name,
      description: "autogenerated",
      event_start_datetime: event.startDateTime.toISOString(),
      event_end_datetime: event.endDateTime.toISOString()
      // Add other properties as needed
    };
  }
}
