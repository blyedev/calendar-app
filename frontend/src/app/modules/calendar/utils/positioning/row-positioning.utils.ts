import {
  PosEvent,
  AdjustEventFunction,
  MatrixPosEvent,
} from '../../models/positioning.models';
import {
  adjustIntervalDay,
  calculateDaysDuration,
} from '../interval-day.utils';
import { eventDaysOverlap } from '../calendar-event.utils';
import { getMatrixConstructor } from './positioning.utils';
import { CalendarEvent, Interval } from '../../models/calendar.models';

const adjustEventDay: AdjustEventFunction = (interval) => (event) => ({
  event: event,
  displayInterval: adjustIntervalDay(interval, event),
});

const calculatePosition =
  (timespan: Interval) =>
  (matrixEvent: MatrixPosEvent): PosEvent => {
    const timespanDur = calculateDaysDuration(timespan.start, timespan.end);
    return {
      ...matrixEvent,
      vertical: {
        top: 24 * matrixEvent.layer,
        height: 24,
      },
      horizontal: {
        left:
          calculateDaysDuration(
            timespan.start,
            matrixEvent.displayInterval.start,
          ) / timespanDur,
        width:
          calculateDaysDuration(
            matrixEvent.displayInterval.start,
            matrixEvent.displayInterval.end,
          ) / timespanDur,
      },
    };
  };

export const gridPositionEvents =
  (timespan: Interval) =>
  (events: readonly CalendarEvent[]): readonly PosEvent[] => {
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
