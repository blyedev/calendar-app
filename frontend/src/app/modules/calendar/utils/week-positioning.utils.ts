import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import {
  PosEvent,
  AdjustEventFunction,
  MatrixPosEvent,
} from '../models/positioning.models';
import { adjustIntervalDay, calculateDaysDuration } from './interval-day.utils';
import { getMatrixConstructor } from './positioning-utils';
import { eventDaysOverlap } from './calendar-event.utils';

const adjustEventDay: AdjustEventFunction = (interval) => (event) => ({
  event: event,
  displayInterval: adjustIntervalDay(interval, event),
});

const calculatePosition =
  (timespan: Interval) =>
  (matrixEvent: MatrixPosEvent): PosEvent => {
    const timespanDur = calculateDaysDuration(timespan);
    return {
      ...matrixEvent,
      vertical: {
        top: 24 * matrixEvent.layer,
        height: 24,
      },
      horizontal: {
        left:
          calculateDaysDuration({
            start: timespan.start,
            end: matrixEvent.displayInterval.start,
          }) / timespanDur,
        width: calculateDaysDuration(matrixEvent.displayInterval) / timespanDur,
      },
    };
  };

export const gridPositionEvents =
  (timespan: Interval) =>
  (events: ReadonlyArray<CalendarEvent>): ReadonlyArray<PosEvent> => {
    const constructRowMatrix = getMatrixConstructor(
      timespan,
      adjustEventDay,
      eventDaysOverlap,
    );

    const matrix = constructRowMatrix(events);

    return matrix.flatMap((evList) => {
      return evList.map(calculatePosition(timespan));
    });
  };
