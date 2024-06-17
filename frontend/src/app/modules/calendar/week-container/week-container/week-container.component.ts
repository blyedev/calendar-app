import { Component, HostBinding } from '@angular/core';
import { CalendarGridCell } from './calendar-event-grid';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from 'src/app/core/models/calendar-event';
import { CalendarEventService } from 'src/app/core/services/calendar-event-service/calendar-event.service';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-week-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './week-container.component.html',
  styleUrls: ['./week-container.component.css']
})
export class WeekContainerComponent {
  private eventSubject$: BehaviorSubject<CalendarEvent[]>;
  positionedEvents: CalendarGridCell[] = [];

  rows: number = 0;

  @HostBinding('style.height.px')
  get containerHeight(): number {
    const height = this.rows * 48 / 2;
    return height;
  }

  constructor(calendarEventService: CalendarEventService) {
    this.eventSubject$ = calendarEventService.getEventsSubject();

    this.eventSubject$.subscribe((events: CalendarEvent[]) => {
      this.positionedEvents = this.getPositionedEvents(this.getFullDayEvents(events));
    })
  }

  private getFullDayEvents(events: CalendarEvent[] | null): CalendarEvent[] {
    if (!events) {
      return [];
    }

    return events.filter((event) => {
      const unixDay = 1000 * 60 * 60 * 24;
      const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
      return Math.floor(unixDaySpan / unixDay) >= 1;
    });
  }

  private getPositionedEvents(events: CalendarEvent[]): CalendarGridCell[] {
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

  sortEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.sort((a, b) => {
      // sorts by which event is earlier
      const startComparison = a.startDateTime.getTime() - b.startDateTime.getTime();
      if (startComparison !== 0) {
        return startComparison;
      }

      // sorts by which event is longer
      const endComparison = b.endDateTime.getTime() - a.endDateTime.getTime();
      if (endComparison !== 0) {
        return endComparison;
      }

      // fallback
      return 0;
    });
  }
}

