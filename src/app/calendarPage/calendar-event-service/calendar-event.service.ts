import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarEvent } from '../calendar-event';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventApiResponse } from './event-api-response';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private baseUrl = environment.apiUrl; // Use the base URL from the environment

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<CalendarEvent[]> {
    const endpoint = 'events/';
    const apiUrl = `${this.baseUrl}${endpoint}`;

    const apiResponse = this.http.get<EventApiResponse[]>(apiUrl);

    return apiResponse.pipe(
      map(data => {
        // Map the API response fields to the CalendarEvent interface
        const mappedData = data.map(item => ({
          id: item.id,
          name: item.title,
          startDateTime: new Date(item.event_start_datetime),
          endDateTime: new Date(item.event_end_datetime)
        }));

        // Log the transformed data here
        console.log(mappedData);

        return mappedData;
      })
    );
  }
}
