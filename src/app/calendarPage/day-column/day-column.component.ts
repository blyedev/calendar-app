import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../calendar-event";
import { PositionedCalendarEvent } from "./positioned-calendar-event";
import { CalendarNode } from "./calendar-event-tree";

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
    const columns: CalendarNode[][] = [];
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
        // check if event fits in the current column
        if (!this.collidesWith(col[col.length - 1].value, ev)) {      
          const calNode = new CalendarNode(ev)
          // sets event's parent
          if (i > 0) {              
            const parentNode = this.getFirstCollider(columns[i - 1], calNode)!
            if (this.collidesWithFirstHour(parentNode.value, calNode.value)) {
              parentNode.topChildren.push(calNode)
            } else {
              parentNode.bottomChildren.push(calNode)
            }
          }
          // puts event in columns
          col.push(calNode);
          // ends positioning
          placed = true;
          break;
        }
      }

      if (!placed) {
        const calNode = new CalendarNode(ev)

        if (columns.length > 0) {
          const parentNode = this.getFirstCollider(columns[columns.length - 1], calNode)!
          if (this.collidesWithFirstHour(parentNode.value, calNode.value)) {
            parentNode.topChildren.push(calNode)
          } else {
            parentNode.bottomChildren.push(calNode)
          }
        }

        columns.push([calNode]);
      }

      if (lastEventEnd === null || ev.endDateTime > lastEventEnd) {
        lastEventEnd = ev.endDateTime;
      }
    })

    this.positionEvents(columns);
    console.log("Endday");
    console.log(this.positionedEvents);
  }

  positionEvents(columns: CalendarNode[][]): void {
    const numColumns = columns.length;

    for (let i = 0; i < numColumns; i++) {
      const col = columns[i];

      col.forEach((ev: CalendarNode) => {
        const colSpan = this.expandEvent(ev.value, i, columns);
        this.positionedEvents.push({
          ...ev.value,
          position: {
            left: i / numColumns,
            width: colSpan / numColumns
          }
        })
      })
    }
  }

  expandEvent(ev: CalendarEvent, iColumn: number, columns: CalendarNode[][]): number {
    let colSpan = 1;

    for (let i = iColumn + 1; i < columns.length; i++) {
      const col = columns[i];
      for (const ev1 of col) {
        if (this.collidesWith(ev, ev1.value)) {
          return colSpan;
        }
      }
      colSpan++;
    }

    return colSpan;
  }

  getFirstCollider(nodes: CalendarNode[], ev: CalendarNode): CalendarNode | null {
    const collider = nodes.find(node => this.collidesWith(node.value, ev.value));
    if (collider) {
      return collider;
    } else {
      return null
    }
  }

  collidesWith(a: PositionedCalendarEvent | CalendarEvent, b: PositionedCalendarEvent | CalendarEvent): boolean {
    return a.endDateTime > b.startDateTime && a.startDateTime < b.endDateTime;
  }

  collidesWithFirstHour(parent: PositionedCalendarEvent | CalendarEvent, child: PositionedCalendarEvent | CalendarEvent): boolean {
    const StartPlusOneHour = new Date(parent.startDateTime);
    StartPlusOneHour.setHours(StartPlusOneHour.getHours() + 1); // Add one hour to the start time of event A

    return StartPlusOneHour > child.startDateTime && parent.startDateTime < child.endDateTime;
  }

}
