import { CalendarEvent } from "../calendar-event";

export interface PositionedCalendarEvent extends CalendarEvent {
    position: {
        left: number;
        width: number;
        zIndex: number;
    };
}