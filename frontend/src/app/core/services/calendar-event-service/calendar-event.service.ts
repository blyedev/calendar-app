import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { EventApiResponse } from "./event-api-response";
import { CalendarEvent } from "../../models/calendar-event";

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private baseUrl = environment.apiUrl;
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);

  constructor(private http: HttpClient) {
    this.refreshEvents();
  }

  refreshEvents(): void {
    this.getAllEvents().subscribe({
      next: (events) => {
        this.eventsSubject.next(events);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  getEventsSubject(): BehaviorSubject<CalendarEvent[]> {
    return this.eventsSubject
  }

  createEvent(newEvent: CalendarEvent): Observable<CalendarEvent> {
    const endpoint = 'events/create/';
    const apiUrl = `${this.baseUrl}${endpoint}`;

    const newApiEvent = {
      title: newEvent.name,
      description: newEvent.description,
      event_start_datetime: newEvent.startDateTime.toISOString(),
      event_end_datetime: newEvent.endDateTime.toISOString()
    };

    return this.http.post<CalendarEvent>(apiUrl, newApiEvent);
  }

  private getAllEvents(): Observable<CalendarEvent[]> {
    const endpoint = 'events/';
    const apiUrl = `${this.baseUrl}${endpoint}`;

    return this.http.get<EventApiResponse[]>(apiUrl)
      .pipe(map((apiResponse: EventApiResponse[]) => {

        const deserializedEvents: CalendarEvent[] = apiResponse
          .map<CalendarEvent>(item => ({
            id: item.id,
            name: item.title,
            description: item.description,
            startDateTime: new Date(item.event_start_datetime),
            endDateTime: new Date(item.event_end_datetime)
          }));

        // TODO Erase in prod
        console.log(deserializedEvents);

        return deserializedEvents;
      }));
  }

  deleteEvent(eventId: number): Observable<void> {
    const endpoint = `events/${eventId}/delete/`;
    const apiUrl = `${this.baseUrl}${endpoint}`;

    return this.http.delete<void>(apiUrl);
  }

}
