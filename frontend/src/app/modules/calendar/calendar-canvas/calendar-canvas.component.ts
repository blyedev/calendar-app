import { Component } from '@angular/core';
import { DayBounds } from 'src/app/core/models/day-bounds';
import { WeekContainerComponent } from '../week-container/week-container/week-container.component';
import { DayContainerComponent } from '../day-container/day-container/day-container.component';

@Component({
  selector: 'app-calendar-canvas',
  standalone: true,
  imports: [WeekContainerComponent, DayContainerComponent],
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css']
})
export class CalendarCanvasComponent {

  dayBoundsList: DayBounds[] = [];

  constructor() {
    for (let i = 0; i < 7; i++) {
      this.dayBoundsList.push(this.getDayBounds(new Date, i));
    }
  }

  private getDayBounds(currentDate: Date, dayIndex: number): DayBounds {
    const currentWeekStart = new Date(currentDate);
    const mondayOffset = currentWeekStart.getDay() > 0 ? currentWeekStart.getDay() - 1 : 6;
    currentWeekStart.setDate(currentWeekStart.getDate() - mondayOffset);
    currentWeekStart.setHours(0, 0, 0, 0);

    // Create dayStart and dayEnd based on the given dayIndex
    const dayStart = new Date(currentWeekStart);
    dayStart.setDate(dayStart.getDate() + dayIndex);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return { dayStart, dayEnd };
  }

}
