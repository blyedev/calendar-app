import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import {
  compareCalendarEvents,
  eventDaysOverlap,
} from './calendar-event.utils';
import {
  WeekPartPosEvent,
  WeekPosEvent,
} from '../models/week-positioning.models';
import { reduceToMatrix } from './positioning-utils';
import { calculateDaysDuration } from './interval.utils';

const addWeekPrimPos =
  (weekSpan: Interval) =>
  (event: CalendarEvent): WeekPartPosEvent => {
    const startIndex = Math.max(
      0,
      calculateDaysDuration({ start: weekSpan.start, end: event.start }),
    );

    const daySpan = Math.min(
      calculateDaysDuration(weekSpan) - 1 - startIndex,
      calculateDaysDuration({ start: weekSpan.start, end: event.end }) -
        startIndex,
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

export const weekPositionEvents =
  (weekSpan: Interval) =>
  (events: ReadonlyArray<CalendarEvent>): ReadonlyArray<WeekPosEvent> => {
    return events
      .toSorted(compareCalendarEvents)
      .map(addWeekPrimPos(weekSpan))
      .reduce(reduceToMatrix<WeekPartPosEvent>(eventDaysOverlap), [])
      .flatMap((evList, i) => {
        return evList.map(addWeekSecPos(i));
      });
  };
