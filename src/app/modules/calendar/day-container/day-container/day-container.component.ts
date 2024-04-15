import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CalendarEvent } from "src/app/core/models/calendar-event";
import { DayBounds } from "src/app/core/models/day-bounds";
import { CalendarEventService } from "src/app/core/services/calendar-event-service/calendar-event.service";

@Component({
  selector: 'app-day-container',
  templateUrl: './day-container.component.html',
  styleUrls: ['./day-container.component.css']
})
export class DayContainerComponent implements OnChanges {
  private eventSubject$: BehaviorSubject<CalendarEvent[]>;

  @Input({ required: true }) dayBounds!: DayBounds;
  events: CalendarEvent[] = [];

  constructor(
    private el: ElementRef,
    calendarEventService: CalendarEventService
  ) {
    this.eventSubject$ = calendarEventService.getEventsSubject();

    this.eventSubject$.subscribe((events: CalendarEvent[]) => {
      this.events = this.getDaysEvents(events);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Daycolumn", this.events, changes)
  }

  private getDaysEvents(events: CalendarEvent[]): CalendarEvent[] {
    const filteredEvents = events
      .filter((event) => {
        const unixDay = 1000 * 60 * 60 * 24;
        const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
        return Math.floor(unixDaySpan / unixDay) < 1;
      })
      .filter((event) => {
        const startsBeforeEnd: boolean = event.startDateTime.getTime() < this.dayBounds.dayEnd.getTime();
        const endsAfterStrart: boolean = event.endDateTime.getTime() > this.dayBounds.dayStart.getTime();
        return startsBeforeEnd && endsAfterStrart;
      });

    return filteredEvents;
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
      const eventStart = new Date(this.dayBounds.dayStart)
      eventStart.setMinutes(eventStart.getMinutes() + (quarterStartIndex * 15))
      const eventEnd = new Date(this.dayBounds.dayStart)
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
        this.events = [...this.events, this.newEventEvent];
        this.newEventEvent = undefined;
      }
    }
  }

  handleEventEvent(event: Event): void {
    event.stopPropagation();
    console.log("Event in relational-event", event);
  }
}
