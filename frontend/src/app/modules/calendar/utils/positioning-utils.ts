import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import {
  AdjustEventFunction,
  AdjustedEvent,
  EventCollisionCheck,
  MatrixPosEvent,
  ReadonlyMatrix,
} from '../models/positioning.models';
import { compareCalendarEvents, eventsOverlap } from './calendar-event.utils';
import { adjustEvent } from './column-positioning.utils';

type Matrix = ReadonlyMatrix<MatrixPosEvent>;
type EventReducer = (acc: Matrix, event: AdjustedEvent) => Matrix;
type Helper = (
  acc: Matrix,
  event: AdjustedEvent,
  currentIndex: number,
) => Matrix;

export const reduceToMatrix = (
  ifEventsCollide: EventCollisionCheck,
): EventReducer => {
  const helper: Helper = (acc, event, currentIndex) => {
    if (acc.length === currentIndex) {
      return [...acc, [{ ...event, layer: currentIndex }]];
    }

    const row = acc[currentIndex];
    if (ifEventsCollide(row[row.length - 1].event, event.event)) {
      return helper(acc, event, currentIndex + 1);
    }

    return acc.map((r, i) =>
      i === currentIndex ? [...r, { ...event, layer: currentIndex }] : r,
    );
  };

  return (acc, event) => helper(acc, event, 0);
};

export const getMatrixConstructor =
  (
    containingInterval: Interval,
    adjustEventFunction: AdjustEventFunction = adjustEvent,
    collisionCheck: EventCollisionCheck = eventsOverlap,
  ) =>
  (events: ReadonlyArray<CalendarEvent>): Matrix => {
    return events
      .toSorted(compareCalendarEvents)
      .map(adjustEventFunction(containingInterval))
      .reduce(reduceToMatrix(collisionCheck), []);
  };
