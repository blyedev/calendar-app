import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CalendarEvent } from "src/app/core/models/calendar-event";
import { DayBounds } from "src/app/core/models/day-bounds";
import { CalendarEventService } from "src/app/core/services/calendar-event-service/calendar-event.service";
import { EventCreationService } from "../event-creation.service";

@Component({
  selector: 'app-day-container',
  templateUrl: './day-container.component.html',
  styleUrls: ['./day-container.component.css']
})
export class DayContainerComponent implements OnChanges {
  @Input({ required: true }) dayBounds!: DayBounds;
  private eventSubject$: BehaviorSubject<CalendarEvent[]>;
  events: CalendarEvent[] = [];

  private isDragging = false;
  private dragStartY = 0;

  drawnEventSubject$: BehaviorSubject<CalendarEvent | undefined>;
  drawnEvent: CalendarEvent | undefined;

  constructor(
    private el: ElementRef,
    public eventCreationService: EventCreationService,
    calendarEventService: CalendarEventService
  ) {
    this.eventSubject$ = calendarEventService.getEventsSubject();

    this.eventSubject$.subscribe((events: CalendarEvent[]) => {
      this.events = this.getDaysEvents(events);
    })

    this.drawnEventSubject$ = this.eventCreationService.getSubject();

    this.drawnEventSubject$.subscribe((drawnEvent: CalendarEvent | undefined) => {
      this.drawnEvent = drawnEvent;
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

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation()

    this.isDragging = true;
    const elementRectangle = this.el.nativeElement.getBoundingClientRect();
    this.dragStartY = event.pageY - elementRectangle.top - window.scrollY

    this.eventCreationService.abortCreating();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      event.stopPropagation()

      // get cursor position
      const elementRectangle = this.el.nativeElement.getBoundingClientRect();
      const currentY = event.pageY - elementRectangle.top - window.scrollY;

      // get coordinates
      let quarterStartIndex, quarterEndIndex;
      if (currentY >= this.dragStartY) {
        quarterStartIndex = Math.floor(this.dragStartY / 12)
        quarterEndIndex = Math.ceil(currentY / 12)
      } else {
        quarterStartIndex = Math.floor(currentY / 12)
        quarterEndIndex = Math.ceil(this.dragStartY / 12)
      }

      // create event content
      const eventStart = new Date(this.dayBounds.dayStart)
      eventStart.setMinutes(eventStart.getMinutes() + (quarterStartIndex * 15))
      const eventEnd = new Date(this.dayBounds.dayStart)
      eventEnd.setMinutes(eventEnd.getMinutes() + (quarterEndIndex * 15))

      this.drawnEvent = {
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

      this.isDragging = false;

      if (this.drawnEvent) {
        this.eventCreationService.startCreating(this.drawnEvent);
      }
    }
  }

  handleEventEvent(event: Event): void {
    event.stopPropagation();
    console.log("Event in relational-event", event);
  }
}
