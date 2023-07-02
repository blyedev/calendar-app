import { CalendarEvent } from "./calendar-event";

export class CalendarEventImpl implements CalendarEvent {
    id: number;
    name: string;
    startDateTime: Date;
    endDateTime: Date;

    constructor(
        id: number,
        name: string,
        startDateTime?: Date,
        endDateTime?: Date
    ) {
        this.id = id;
        this.name = name;

        // If startDateTime is not specified, set it to the current date with a random hour
        if (startDateTime === undefined) {
            const currentDateTime = new Date();
            const randomHour = Math.floor(Math.random() * 24); // Random hour between 0 and 23
            currentDateTime.setHours(randomHour, 0, 0, 0);
            this.startDateTime = currentDateTime;
        } else {
            this.startDateTime = startDateTime;
        }

        // If endDateTime is not specified, set it to a random hour that's at least an hour later than startDateTime
        if (endDateTime === undefined) {
            const minimumEndHour = this.startDateTime.getHours() + 1;
            const randomEndHour = minimumEndHour + Math.floor(Math.random() * (24 - minimumEndHour)); // Random hour between minimumEndHour and 23
            this.endDateTime = new Date(this.startDateTime);
            this.endDateTime.setHours(randomEndHour, 0, 0, 0);
        } else {
            this.endDateTime = endDateTime;
        }
    }
}