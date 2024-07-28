import { CalendarEvent } from 'src/app/core/models/calendar.models';
import {
  EventCollisionCheck,
  ReadonlyMatrix,
} from '../models/positioning.models';

export const reduceToMatrix = <T extends { event: CalendarEvent }>(
  ifEventsCollide: EventCollisionCheck,
): ((acc: ReadonlyMatrix<T>, event: T) => ReadonlyMatrix<T>) => {
  const helper = (
    acc: ReadonlyMatrix<T>,
    event: T,
    currentIndex: number,
  ): ReadonlyMatrix<T> => {
    if (acc.length === currentIndex) {
      return [...acc, [event]];
    }

    const row = acc[currentIndex];
    if (!ifEventsCollide(row[row.length - 1].event, event.event)) {
      return acc.map((r, i) => (i === currentIndex ? [...r, event] : r));
    }
    return helper(acc, event, currentIndex + 1);
  };

  return (acc, event) => helper(acc, event, 0);
};
