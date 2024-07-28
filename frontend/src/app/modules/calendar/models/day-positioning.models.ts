import { CalendarEvent } from 'src/app/core/models/calendar.models';

export interface DayPosEvent extends DayPartPosEvent {
  readonly secAxisPos: SecAxisPos;
}

export interface DayPartPosEvent {
  event: CalendarEvent;
  readonly primAxisPos: PrimAxisPos;
}

interface PrimAxisPos {
  readonly startTime: Date;
  readonly endTime: Date;
}

interface SecAxisPos {
  readonly left: number;
  readonly width: number;
  readonly zIndex: number;
}
