import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../calendar-event";

@Component({
  selector: 'app-day-column',
  templateUrl: './day-column.component.html',
  styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent {
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) { }

  @Input() events: CalendarEvent[] = [];
  @Input() dayBoundaries!: { dayStart: Date, dayEnd: Date };

  isDragging = false;
  newEventStartY = 0;
  newEventTop = 0;
  newEventHeight = 0;
  newEventEvent: CalendarEvent | undefined;

  ngOnChanges(changes: SimpleChanges) {
    console.log("Daycolumn", this.events, changes)
  }

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
        id: undefined,
        name: "Untitled",
        startDateTime: eventStart,
        endDateTime: eventEnd
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    event.stopPropagation
    if (this.isDragging) {
      // Handle mouseup only if the component was actively dragging
      // console.log('Handling mouseup in the active drag component');
      // console.log('Mouse up:', event);

      this.isDragging = false;
      this.newEventStartY = 0;
      // this.newEventTop = 0;
      // this.newEventHeight = 0;

      if (this.newEventEvent) {
        this.events = [...this.events, (this.newEventEvent)]
        this.newEventEvent = undefined;
      }
    }
  }
}