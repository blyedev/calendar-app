import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar-event';
import { DayBounds } from 'src/app/core/models/day-bounds';

@Pipe({
  name: 'isWithinDayBounds',
  standalone: true,
})
export class IsWithinDayBoundsPipe implements PipeTransform {

  transform(event: CalendarEvent, dayBounds: DayBounds): CalendarEvent | undefined {
    const startsBeforeEnd: boolean = event.startDateTime.getTime() < dayBounds.dayEnd.getTime();
    const endsAfterStrart: boolean = event.endDateTime.getTime() > dayBounds.dayStart.getTime();
    return startsBeforeEnd && endsAfterStrart ? event : undefined;
  }

}
