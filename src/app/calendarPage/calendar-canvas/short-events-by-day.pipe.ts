import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from '../calendar-event';

@Pipe({
  name: 'shortEventsByDay'
})
export class ShortEventsByDayPipe implements PipeTransform {

  transform(events: CalendarEvent[] | null, dayBounds: { dayStart: Date, dayEnd: Date }): CalendarEvent[] {
    if (!events) {
      return [];
    }

    return events
      .filter((event) => {
        const unixDay = 1000 * 60 * 60 * 24;
        const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
        return Math.floor(unixDaySpan / unixDay) < 1;
      })
      .filter((event) => {
        return event.startDateTime.getTime() < dayBounds.dayEnd.getTime() && event.endDateTime.getTime() > dayBounds.dayStart.getTime();
      });
  }

}
