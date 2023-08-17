import { CalendarEvent } from "./calendar-event";

export class RandomCalendarEvent implements CalendarEvent {
    id: number;
    name: string;
    startDateTime: Date;
    endDateTime: Date;

    constructor(
        id: number,
        name?: string,
        startDateTime?: Date,
        endDateTime?: Date,
        forceSameDay: boolean = true
    ) {
        this.id = id;
        this.name = name || this.getRandomEventName();
        if (startDateTime === undefined || endDateTime === undefined) {
            [this.startDateTime, this.endDateTime] = this.getRandomDateRange(startDateTime, endDateTime, forceSameDay);
        } else {
            this.startDateTime = startDateTime;
            this.endDateTime = endDateTime;
        }
    }

    private getRandomEventName(): string {
        const plausibleEventNames: string[] = [
            'Meeting',
            'Conference',
            'Seminar',
            'Workshop',
            'Training Session',
            'Webinar',
            'Product Launch',
            'Team Building',
            'Networking Event',
            'Panel Discussion',
            'Hackathon',
            'Exhibition',
            'Trade Show',
            'Symposium',
            'Lecture',
            'Keynote Address',
            'Career Fair',
            'Social Gathering',
            'Charity Fundraiser',
            'Art Exhibition',
            'Music Concert',
            'Film Screening',
            'Book Reading',
            'Food Tasting',
            'Sports Event',
            'Community Service',
            'Award Ceremony',
            'Business Dinner',
            'Fundraising Gala',
            'Art Workshop',
            'Tech Talk',
        ];

        const randomIndex = Math.floor(Math.random() * plausibleEventNames.length);
        return plausibleEventNames[randomIndex];
    }

    private getRandomDateRange(inputStartDateTime: Date | undefined, inputEndDateTime: Date | undefined, forceSameDay: boolean): [Date, Date] {
        const { currentWeekStart, currentWeekEnd } = getWeekBounds();
        // validateInputDates();
        
        const startDateTime = new Date();
        const endDateTime = new Date();

        let daySpan: number;
        if (!forceSameDay) {
            daySpan = Math.floor(Math.random() * 7);
        } else {
            daySpan = 0;
        }
        const startDayIndex = Math.floor(Math.random() * (7 - daySpan));

        startDateTime.setDate(currentWeekStart.getDate() + startDayIndex);
        endDateTime.setDate(currentWeekStart.getDate() + startDayIndex + daySpan);

        let hourSpan: number;
        let startHour: number;
        let endHour: number;
        if (startDateTime.getTime() !== endDateTime.getTime()) {
            hourSpan = Math.floor(Math.random() * 48) + 1; // Force at least an hour
            if (hourSpan > 24) {
                startHour = Math.floor(Math.random() * (48 + 1 - hourSpan)); // + 1 so ending on 24 can be included
            } else {
                startHour = 24 - Math.floor(Math.random() * (hourSpan + 1));
            }
            endHour = startHour + hourSpan - 24
        } else {
            hourSpan = Math.floor(Math.random() * 24) + 1; // Force at least an hour
            startHour = Math.floor(Math.random() * (24 + 1 - hourSpan)); // + 1 so ending on 24 can be included
            endHour = startHour + hourSpan
        }

        startDateTime.setHours(startHour, 0, 0, 0);
        endDateTime.setHours(endHour, 0, 0, 0);

        return [startDateTime, endDateTime];

        function validateInputDates() {
            if (inputStartDateTime && (inputStartDateTime <= currentWeekStart || inputStartDateTime >= currentWeekEnd)) {
                throw new Error("Start date is out of bounds for the current week for a custom component");
            }

            if (inputEndDateTime && (inputEndDateTime <= currentWeekStart || inputEndDateTime >= currentWeekEnd)) {
                throw new Error("End date is out of bounds for the current week for a custom component");
            }
        }

        function getWeekBounds() {
            const currentDate = new Date();

            const currentWeekStart = new Date(currentDate);
            const mondayOffset = currentWeekStart.getDay() > 0 ? currentWeekStart.getDay() - 1 : 6; // 0 (Sunday) to 6 (Saturday)
            currentWeekStart.setDate(currentWeekStart.getDate() - mondayOffset);
            currentWeekStart.setHours(0, 0, 0, 0); // Midnight of Monday

            const currentWeekEnd = new Date(currentWeekStart);
            currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);
            currentWeekEnd.setHours(0, 0, 0, 0); // Midnight after Sunday
            
            return { currentWeekStart, currentWeekEnd }; 
        }
    }

}
