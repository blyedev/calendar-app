import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar-event';

@Pipe({
  name: 'getCreatedEvent'
})
export class GetCreatedEventPipe implements PipeTransform {

  transform(events: CalendarEvent[]): CalendarEvent | undefined {
    return events.find((event) => {
      return event.id === 0
    });
  }

}
