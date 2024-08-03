import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';

export interface DayPosEvent extends DayPartPosEvent {
  readonly secAxisPos: SecAxisPos;
}

export interface DayPartPosEvent {
  event: CalendarEvent;
  readonly primAxisPos: Interval;
}

interface SecAxisPos {
  readonly left: number;
  readonly width: number;
  readonly zIndex: number;
}
