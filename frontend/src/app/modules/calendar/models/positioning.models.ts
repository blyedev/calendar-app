import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';

export interface EventWrapper {
  readonly event: CalendarEvent;
}

export interface AdjustedEvent extends EventWrapper {
  readonly displayInterval: Interval;
}

interface VerticalPos {
  readonly top: number;
  readonly height: number;
}

interface HorizontalPos {
  readonly left: number;
  readonly width: number;
}

export interface MatrixPosEvent extends AdjustedEvent {
  readonly layer: number;
}

export interface PosEvent extends MatrixPosEvent {
  readonly vertical: VerticalPos;
  readonly horizontal: HorizontalPos;
}

export type ReadonlyMatrix<T> = readonly (readonly T[])[];

export type EventCollisionCheck = (
  event1: CalendarEvent,
  event2: CalendarEvent,
) => boolean;

export type AdjustEventFunction = (
  interval: Interval,
) => (event: CalendarEvent) => AdjustedEvent;
