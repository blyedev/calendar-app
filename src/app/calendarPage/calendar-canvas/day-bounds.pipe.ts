import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayBounds'
})
export class DayBoundsPipe implements PipeTransform {

  transform(currentDate: Date, dayIndex: number): { dayStart: Date, dayEnd: Date } {
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
