import { CalendarEvent } from "../calendar-event";

export interface PositionedCalendarEvent {
    value: CalendarEvent;
    position: {
        startDateTime: Date;
        endDateTime: Date
        left: number;
        width: number;
        zIndex: number;
    };
}