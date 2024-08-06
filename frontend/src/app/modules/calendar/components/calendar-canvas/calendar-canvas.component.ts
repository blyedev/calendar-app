import { Component } from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { WeekContainerComponent } from '../week-container/week-container.component';
import { DayContainerComponent } from '../day-container/day-container.component';

@Component({
  selector: 'app-calendar-canvas',
  standalone: true,
  imports: [WeekContainerComponent, DayContainerComponent],
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css'],
})
export class CalendarCanvasComponent {
  public weekSpan: Interval;
  public daySpans: Interval[];

  constructor() {
    const now: Date = new Date();

    this.weekSpan = this.getWeekSpanFromDate(now);
    this.daySpans = this.getDaySpans(this.weekSpan.start, 7);
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
