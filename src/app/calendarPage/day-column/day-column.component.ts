import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../calendar-event";
import { PositionedCalendarEvent } from "./positioned-calendar-event";

@Component({
  selector: 'app-day-column',
  templateUrl: './day-column.component.html',
  styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent implements OnInit {
  @Input() events!: CalendarEvent[];
  initialized!: boolean;

  positionedEvents: PositionedCalendarEvent[] = [];

  ngOnInit(): void {
    this.layoutEvents();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && changes["events"] && changes["events"].currentValue) {
      // Perform your logic here whenever the 'events' array changes
      console.log('Events changed:', this.events);
      this.layoutEvents();
    }
  }

  layoutEvents(): void {
    const columns : CalendarEvent[][] = [];
    let lastEventEnd: Date | null = null;

    this.events.forEach((ev: CalendarEvent) => {
      if (lastEventEnd !== null && ev.startDateTime >= lastEventEnd) {
        this.positionEvents(columns);
        columns.length = 0;
        lastEventEnd = null;
      }

      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!this.collidesWith(col[col.length - 1], ev)) {
          col.push(ev);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([ev]);
      }

      if (lastEventEnd === null || ev.endDateTime > lastEventEnd) {
        lastEventEnd = ev.endDateTime;
      }
    })

    this.positionEvents(columns);
    console.log(this.positionedEvents);
    
  }

  positionEvents(columns: CalendarEvent[][]): void {
    const numColumns = columns.length;

    for (let i = 0; i < numColumns; i++) {
      const col = columns[i];
      const colSpan = 1; // make sure to change this

      col.forEach((ev: CalendarEvent) => {
        this.positionedEvents.push({
          ...ev,
          position: {
            left: i / numColumns,
            width: colSpan / numColumns
          }
        })
      })
    }
  }

  // expandEvent(ev: PositionedCalendarEvent, iColumn: number, columns: PositionedCalendarEvent[][]): number {
  //   let colSpan = 1;

  //   for (let i = iColumn + 1; i < columns.length; i++) {
  //     const col = columns[i];
  //     for (const ev1 of col) {
  //       if (this.collidesWith(ev, ev1)) {
  //         return colSpan;
  //       }
  //     }
  //     colSpan++;
  //   }

  //   return colSpan;
  // }

  collidesWith(a: PositionedCalendarEvent | CalendarEvent, b: PositionedCalendarEvent | CalendarEvent): boolean {
    return a.endDateTime > b.startDateTime && a.startDateTime < b.endDateTime;
  }
}
