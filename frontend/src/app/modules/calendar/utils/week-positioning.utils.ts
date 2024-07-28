import { CalendarEvent, TimeSpan } from 'src/app/core/models/calendar.models';
import {
  calculateDayOffset,
  calEventComparator,
  ifDaysCollide,
} from './calendar-event.utils';
import {
  WeekPartPosEvent,
  WeekPosEvent,
} from '../models/week-positioning.models';
import { reduceToMatrix } from './positioning-utils';

const addWeekPrimPos =
  (weekSpan: TimeSpan) =>
  (event: CalendarEvent): WeekPartPosEvent => {
    const startIndex = Math.max(
      0,
      calculateDayOffset(weekSpan.start, event.eventStart),
    );

    const daySpan = Math.min(
      calculateDayOffset(weekSpan.start, weekSpan.end) - 1 - startIndex,
      calculateDayOffset(weekSpan.start, event.eventEnd) - startIndex,
    );

    return {
      event: event,
      primAxisPos: {
        startIndex: startIndex,
        daySpan: daySpan,
      },
    };
  };

const addWeekSecPos =
  (row: number) =>
  (event: WeekPartPosEvent): WeekPosEvent => {
    return {
      ...event,
      secAxisPos: {
        row: row,
      },
    };
  };

export const weekPositionEvents = (
  events: ReadonlyArray<CalendarEvent>,
  weekSpan: TimeSpan,
): ReadonlyArray<WeekPosEvent> => {
  return events
    .toSorted(calEventComparator)
    .map(addWeekPrimPos(weekSpan))
    .reduce(reduceToMatrix<WeekPartPosEvent>(ifDaysCollide), [])
    .flatMap((evList, i) => {
      return evList.map(addWeekSecPos(i));
    });
};
