import { Component, HostBinding, Input, SimpleChanges } from '@angular/core';
import { CalendarEvent } from '../calendar-event';
import { CalendarGridCell } from './calendar-event-grid';

@Component({
  selector: 'app-week-row',
  templateUrl: './week-row.component.html',
  styleUrls: ['./week-row.component.css']
})
export class WeekRowComponent {
  @Input() events: CalendarEvent[] = [];

  rows: number = 0;

  @HostBinding('style.height.px')
  get containerHeight(): number {
    const height = this.rows * 48 / 2;
    return height;
  }

  getPositionedEvents(events: CalendarEvent[]) {
    const laidOutEvents = this.layoutEvents(events);

    this.rows = laidOutEvents.length;

    const positionedEvents = this.unpackColumns(laidOutEvents);
    return positionedEvents
  }

  private layoutEvents(events: CalendarEvent[]): CalendarGridCell[][] {
    const sortedEvents = this.sortEvents(events);

    const columns: CalendarGridCell[][] = [];
    sortedEvents.forEach((ev: CalendarEvent) => {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]
        if (!collidesWith(col[col.length - 1].value, ev)) {
          let startIndex = this.getStartIndex(ev);
          if (startIndex < 0) {
            startIndex = 0
          }

          let daySpan = this.getDaySpan(ev);
          if (startIndex + daySpan > 6) {
            daySpan = 6 - startIndex
          }

          const calGridCell = new CalendarGridCell(ev, i, startIndex, daySpan);

          col.push(calGridCell);
          placed = true;
          break;
        }
      }

      if (!placed) {
        let startIndex = this.getStartIndex(ev);
        if (startIndex < 0) {
          startIndex = 0
        }

        let daySpan = this.getDaySpan(ev);
        if (startIndex + daySpan > 6) {
          daySpan = 6 - startIndex
        }

        const calGridCell = new CalendarGridCell(ev, columns.length, startIndex, daySpan)

        columns.push([calGridCell])
      }
    })

    return columns

    // Helper functions

    function collidesWith(ev1: CalendarEvent, ev2: CalendarEvent) {
      const ev1StartDay = new Date(ev1.startDateTime)
      ev1StartDay.setHours(0, 0, 0, 0)
      const ev1EndDay = new Date(ev1.endDateTime)
      ev1EndDay.setHours(0, 0, 0, 0)
      const ev2StartDay = new Date(ev2.startDateTime)
      ev2StartDay.setHours(0, 0, 0, 0)
      const ev2EndDay = new Date(ev2.endDateTime)
      ev2EndDay.setHours(0, 0, 0, 0)

      return ev1EndDay.getTime() >= ev2StartDay.getTime() && ev1StartDay.getTime() <= ev2EndDay.getTime();
    }
  }

  private unpackColumns(columns: CalendarGridCell[][]): CalendarGridCell[] {
    const positionedEvents: CalendarGridCell[] = []
    columns.forEach((col: CalendarGridCell[]) => {
      col.forEach((gridEv: CalendarGridCell) => {
        positionedEvents.push(gridEv)
      })
    })

    return positionedEvents
  }

  private getDaySpan(ev: CalendarEvent) {
    const unixDay = 1000 * 60 * 60 * 24

    const strippedStart = new Date(ev.startDateTime);
    const strippedEnd = new Date(ev.endDateTime);
    strippedStart.setHours(0, 0, 0, 0);
    strippedEnd.setHours(0, 0, 0, 0);
    const unixDaySpan = strippedEnd.getTime() - strippedStart.getTime();
    const daySpan = Math.floor(unixDaySpan / unixDay);

    return daySpan;
  }

  private getStartIndex(ev: CalendarEvent) {
    const currentDate = new Date();

    const currentWeekStart = new Date(currentDate);
    const mondayOffset = currentWeekStart.getDay() > 0 ? currentWeekStart.getDay() - 1 : 6; // 0 (Sunday) to 6 (Saturday)
    currentWeekStart.setDate(currentWeekStart.getDate() - mondayOffset);
    currentWeekStart.setHours(0, 0, 0, 0); // Midnight of Monday

    const unixDay = 1000 * 60 * 60 * 24

    const unixSinceWeekStart = ev.startDateTime.getTime() - currentWeekStart.getTime()
    const startIndex = Math.floor(unixSinceWeekStart / unixDay)

    return startIndex;
  }

  private sortEvents(events: CalendarEvent[]): CalendarEvent[] {
    events.sort((a, b) => {
      const aStartIndex = this.getStartIndex(a);
      const bStartIndex = this.getStartIndex(b);

      if (aStartIndex < bStartIndex) {
        return -1;
      } else if (aStartIndex > bStartIndex) {
        return 1;
      } else {
        const aDaySpan = this.getDaySpan(a);
        const bDaySpan = this.getDaySpan(b);

        if (aDaySpan < bDaySpan) {
          return 1;
        } else if (aDaySpan > bDaySpan) {
          return -1;
        } else {
          return a.id - b.id;
        }
      }
    });

    return events
  }
}

