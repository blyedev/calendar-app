import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { PositionedCalendarEvent } from '../day-column/positioned-calendar-event';

@Component({
  selector: 'app-relational-event',
  templateUrl: './relational-event.component.html',
  styleUrls: ['./relational-event.component.css']
})
export class RelationalEventComponent {
  @Input() event!: PositionedCalendarEvent; // Assuming you pass the event object to the component using an input property

  @HostBinding('style.top.px')
  get topPosition(): number {
    const hours = this.event.startDateTime.getHours();
    return hours * 48;
  }

  @HostBinding('style.height.px')
  get eventHeight(): number {
    const startHour = this.event.startDateTime.getHours();
    let endHour = this.event.endDateTime.getHours();
    if (endHour === 0) {
      endHour = 24
    }
    const height = (endHour - startHour) * 48;
    return height;
  }

  @HostBinding('style.left')
  get leftPosition(): string {
    return `calc((100% - 8px) * ${this.event.position.left})`;
  }

  @HostBinding('style.width')
  get eventWidth(): string {
    if (this.event.position.width * 7 / 5 + this.event.position.left > 1) {
      return `calc((100% - 8px) * ${1 - this.event.position.left})`;
    } else {
      return `calc((100% - 8px) * ${this.event.position.width * 7 / 5})`;
    }
    // return `calc((100% - 8px) * ${this.event.position.width})`;
  }

  @HostBinding('style.z-index')
  get zIndex(): number {
    return this.event.position.zIndex;
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    console.log(this.event);
  }
}