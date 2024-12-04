import { Component } from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { ColumnContainerComponent } from '../column-container/column-container.component';
import { RowContainerComponent } from '../row-container/row-container.component';

@Component({
  selector: 'app-calendar-canvas',
  imports: [ColumnContainerComponent, RowContainerComponent],
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css'],
})
export class CalendarCanvasComponent {
  public rowTimespan: Interval;
  public columnTimespans: Interval[];

  constructor() {
    const now: Date = new Date();

    this.rowTimespan = this.getWeekSpanFromDate(now);
    this.columnTimespans = this.getDaySpans(this.rowTimespan.start, 7);
  }

  private getWeekSpanFromDate(date: Date): Interval {
    const weekStart = new Date(date);
    const mondayOffset = weekStart.getDay() > 0 ? weekStart.getDay() - 1 : 6;
    weekStart.setDate(weekStart.getDate() - mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd: Date = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    return { start: weekStart, end: weekEnd };
  }

  private getDaySpans(startDate: Date, count: number): Interval[] {
    const daySpans: Interval[] = [];

    const currDate = new Date(startDate);
    for (let i = 0; i < count; i++) {
      const dayStart = new Date(currDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      daySpans.push({ start: dayStart, end: dayEnd });
      currDate.setDate(currDate.getDate() + 1);
    }

    return daySpans;
  }
}
