import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../calendar-event";
import { CalendarEventService } from "../calendar-event-service/calendar-event.service";

@Component({
  selector: 'app-day-column',
  templateUrl: './day-column.component.html',
  styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent {
  constructor(private el: ElementRef) { }

  @Input() events: CalendarEvent[] = [];
  @Input() dayBoundaries!: { dayStart: Date, dayEnd: Date };

  ngOnChanges(changes: SimpleChanges) {
    console.log("Daycolumn", this.events, changes)
  }

  isDragging = false;
  newEventStartY = 0;
  newEventTop = 0;
  newEventHeight = 0;
  newEventEvent: {
    name: string,
    startDateTime: Date,
    endDateTime: Date
  } | undefined;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation
    // console.log('Mouse down:', event);

    this.isDragging = true;
    const elementRectangle = this.el.nativeElement.getBoundingClientRect();
    this.newEventStartY = event.pageY - elementRectangle.top - window.scrollY
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      event.stopPropagation
      // console.log('Mouse move:', event);

      // get cursor position
      const elementRectangle = this.el.nativeElement.getBoundingClientRect();
      const currentY = event.pageY - elementRectangle.top - window.scrollY;

      // get coordinates
      let quarterStartIndex, quarterEndIndex;
      if (currentY >= this.newEventStartY) {
        quarterStartIndex = Math.floor(this.newEventStartY / 12)
        quarterEndIndex = Math.ceil(currentY / 12)
      } else {
        quarterStartIndex = Math.floor(currentY / 12)
        quarterEndIndex = Math.ceil(this.newEventStartY / 12)
      }

      // set event position
      this.newEventTop = quarterStartIndex * 12;
      this.newEventHeight = quarterEndIndex * 12 - this.newEventTop

      // create event content
      const eventStart = new Date(this.dayBoundaries.dayStart)
      eventStart.setMinutes(eventStart.getMinutes() + (quarterStartIndex * 15))
      const eventEnd = new Date(this.dayBoundaries.dayStart)
      eventEnd.setMinutes(eventEnd.getMinutes() + (quarterEndIndex * 15))

      this.newEventEvent = {
        name: "Untitled",
        startDateTime: eventStart,
        endDateTime: eventEnd
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    event.stopPropagation()
    if (this.isDragging) {
      // Handle mouseup only if the component was actively dragging
      // console.log('Handling mouseup in the active drag component');
      // console.log('Mouse up:', event);

      this.isDragging = false;
      this.newEventStartY = 0;

      if (this.newEventEvent) {
        const tempEvent: CalendarEvent = {
          id: 0,
          name: this.newEventEvent.name,
          startDateTime: this.newEventEvent.startDateTime,
          endDateTime: this.newEventEvent.endDateTime
        }
        this.events = [...this.events, tempEvent];
        this.newEventEvent = undefined;
      }
    }
  }

  handleEventEvent(event: Event): void {
    event.stopPropagation();
    console.log("Event in relational-event", event);
    // Perform your logic for clicks inside the child component
  }
}