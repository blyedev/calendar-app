import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from '../calendar-event';

@Pipe({
  name: 'fullDayEvents'
})
export class FullDayEventsPipe implements PipeTransform {

  transform(events: CalendarEvent[] | null): CalendarEvent[] {
    if (!events) {
      return [];
    }

    return events.filter((event) => {
      const unixDay = 1000 * 60 * 60 * 24;
      const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
      return Math.floor(unixDaySpan / unixDay) >= 1;
    });
  }

}
