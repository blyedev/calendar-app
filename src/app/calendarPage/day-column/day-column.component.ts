import { Component, ElementRef, HostListener, Input, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../calendar-event";
import { DayContainer } from "./day-container";

@Component({
  selector: 'app-day-column',
  templateUrl: './day-column.component.html',
  styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent {
  constructor(private el: ElementRef) { }

  @Input({ required: true }) dayContainer!: DayContainer;

  ngOnChanges(changes: SimpleChanges) {
    console.log("Daycolumn", this.dayContainer.events, changes)
  }

  isDragging = false;
  newEventStartY = 0;
  newEventTop = 0;
  newEventHeight = 0;
  newEventEvent: CalendarEvent | undefined;

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
      const eventStart = new Date(this.dayContainer.dayBounds.dayStart)
      eventStart.setMinutes(eventStart.getMinutes() + (quarterStartIndex * 15))
      const eventEnd = new Date(this.dayContainer.dayBounds.dayStart)
      eventEnd.setMinutes(eventEnd.getMinutes() + (quarterEndIndex * 15))

      this.newEventEvent = {
        id: 0,
        name: "Untitled",
        description: "",
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
        this.dayContainer.events = [...this.dayContainer.events, this.newEventEvent];
        this.newEventEvent = undefined;
      }
    }
  }

  handleEventEvent(event: Event): void {
    event.stopPropagation();
    console.log("Event in relational-event", event);
  }
}
