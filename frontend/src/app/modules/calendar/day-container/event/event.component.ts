import { Component, HostBinding, Input } from '@angular/core';
import { TimeSpan } from 'src/app/core/models/calendar.models';
import { DayPosEvent } from '../../models/day-positioning.models';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  @Input({ required: true }) event!: DayPosEvent;
  @Input({ required: true }) dayBounds!: TimeSpan;

  @HostBinding('style.top.px')
  get topPosition(): number {
    const startTime = this.event.primAxisPos.startTime;
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    return (hours + minutes / 60) * 48;
  }

  @HostBinding('style.height.px')
  get eventHeight(): number {
    const startDateTime = this.event.primAxisPos.startTime;
    const startHour = startDateTime.getHours();
    const startMinutes = startDateTime.getMinutes();
    const startTime = startHour + startMinutes / 60;

    // get endhour and minute
    const endDateTime = this.event.primAxisPos.endTime;
    let endHour = endDateTime.getHours();
    if (endDateTime.valueOf() == this.dayBounds.end.valueOf()) {
      endHour = 24;
    }
    const endMinutes = endDateTime.getMinutes();
    const endTime = endHour + endMinutes / 60;

    const height = (endTime - startTime) * 48;
    return height;
  }

  @HostBinding('style.left')
  get leftPosition(): string {
    return `calc((100% - 8px) * ${this.event.secAxisPos.left})`;
  }

  @HostBinding('style.width')
  get eventWidth(): string {
    if (
      (this.event.secAxisPos.width * 7) / 5 + this.event.secAxisPos.left >
      1
    ) {
      return `calc((100% - 8px) * ${1 - this.event.secAxisPos.left})`;
    } else {
      return `calc((100% - 8px) * ${(this.event.secAxisPos.width * 7) / 5})`;
    }
    // return `calc((100% - 8px) * ${this.event.position.width})`;
  }

  @HostBinding('style.z-index')
  get zIndex(): number {
    return this.event.secAxisPos.zIndex;
  }
}
