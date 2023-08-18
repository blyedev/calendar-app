import { CalendarEvent } from "../calendar-event";

export class CalendarGridCell {
    constructor(
        public value: CalendarEvent,
        public row: number,
        public startIndex: number,
        public daySpan: number
    ) {}
}