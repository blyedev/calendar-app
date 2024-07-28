import { CalendarEvent } from 'src/app/core/models/calendar.models';

export type ReadonlyMatrix<T> = ReadonlyArray<ReadonlyArray<T>>;
export type EventCollisionCheck = (
  event1: CalendarEvent,
  event2: CalendarEvent,
) => boolean;
