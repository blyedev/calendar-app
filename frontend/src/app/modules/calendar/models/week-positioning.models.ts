import { CalendarEvent } from 'src/app/core/models/calendar.models';

export interface WeekPosEvent extends WeekPartPosEvent {
  readonly secAxisPos: SecAxisPos;
}

export interface WeekPartPosEvent {
  event: CalendarEvent;
  readonly primAxisPos: PrimAxisPos;
}

interface PrimAxisPos {
  readonly startIndex: number;
  readonly daySpan: number;
}

interface SecAxisPos {
  readonly row: number;
}
