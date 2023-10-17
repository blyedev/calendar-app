import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from '../../calendar-event';

@Pipe({
  name: 'getNewEvent'
})
export class GetNewEventPipe implements PipeTransform {

  transform(events: CalendarEvent[]): CalendarEvent | undefined {
    return events.find((event) => {
      return event.id === 0
    });
  }

}
