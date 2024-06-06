import { Component, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { PositionedCalendarEvent } from '../day-container/positioned-calendar-event';
import { CalendarEventService } from 'src/app/core/services/calendar-event-service/calendar-event.service';
import { DayBounds } from 'src/app/core/models/day-bounds';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  @Input({ required: true }) event!: PositionedCalendarEvent;
  @Input({ required: true }) dayBounds!: DayBounds;

  constructor(
    private elementRef: ElementRef,
    private calendarEventService: CalendarEventService) { }

  @HostListener('click', ['$event'])
  onClick() {
    // Access the native element directly and set focus
    (this.elementRef.nativeElement as HTMLElement).focus();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      // Handle the delete key press
      console.log('Delete key pressed inside the component.');

      // Call the deleteEvent method from your service
      this.calendarEventService.deleteEvent(this.event.value.id).subscribe({
        next: () => {
          console.log('Event deleted successfully');
          this.calendarEventService.refreshEvents();
        },
        error: (error) => console.error('Error deleting event:', error),
        complete: () => {
          // Additional logic if needed
        }
      });
    }
  }

  @HostBinding('style.top.px')
  get topPosition(): number {
    const hours = this.event.position.startDateTime.getHours();
    const minutes = this.event.position.startDateTime.getMinutes();
    return (hours + minutes / 60) * 48;
  }

  @HostBinding('style.height.px')
  get eventHeight(): number {
    // get starthour and minute
    const startHour = this.event.position.startDateTime.getHours();
    const startMinutes = this.event.position.startDateTime.getMinutes();
    const startTime = startHour + startMinutes / 60;

    // get endhour and minute
    let endHour = this.event.position.endDateTime.getHours();
    if (this.event.position.endDateTime.valueOf() == this.dayBounds.dayEnd.valueOf()) {
      endHour = 24
    }
    const endMinutes = this.event.position.endDateTime.getMinutes();
    const endTime = endHour + endMinutes / 60

    const height = (endTime - startTime) * 48;
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
}
