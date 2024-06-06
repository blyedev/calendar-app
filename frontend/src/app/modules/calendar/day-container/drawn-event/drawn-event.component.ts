import { Component, HostBinding, Input } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar-event';
import { DayBounds } from 'src/app/core/models/day-bounds';

@Component({
  selector: 'app-drawn-event',
  templateUrl: './drawn-event.component.html',
  styleUrls: ['./drawn-event.component.css']
})
export class DrawnEventComponent {
  @Input({ required: true }) event!: CalendarEvent;
  @Input({ required: true }) dayBounds!: DayBounds;

  @HostBinding('style.top.px')
  get topPosition(): number {
    const adjustedStart = this.adjustDateWithinBoundaries(this.event.startDateTime, this.dayBounds);

    const hours = adjustedStart.getHours();
    const minutes = adjustedStart.getMinutes();
    return (hours + minutes / 60) * 48;
  }

  @HostBinding('style.height.px')
  get eventHeight(): number {
    const adjustedStart = this.adjustDateWithinBoundaries(this.event.startDateTime, this.dayBounds);
    const adjustedEnd = this.adjustDateWithinBoundaries(this.event.endDateTime, this.dayBounds);
    // get starthour and minute
    const startHour = adjustedStart.getHours();
    const startMinutes = adjustedStart.getMinutes();
    const startTime = startHour + startMinutes / 60;

    // get endhour and minute
    let endHour = adjustedEnd.getHours();
    if (adjustedEnd.valueOf() == this.dayBounds.dayEnd.valueOf()) {
      endHour = 24
    }
    const endMinutes = adjustedEnd.getMinutes();
    const endTime = endHour + endMinutes / 60

    const height = (endTime - startTime) * 48;
    return height;
  }


  private adjustDateWithinBoundaries(date: Date, dayBounds: DayBounds): Date {
    if (date < dayBounds.dayStart) {
      return new Date(dayBounds.dayStart);
    } else if (date > dayBounds.dayEnd) {
      return new Date(dayBounds.dayEnd);
    }
    return date;
  }
}

