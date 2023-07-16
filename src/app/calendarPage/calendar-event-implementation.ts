import { CalendarEvent } from "./calendar-event";

export class CalendarEventImpl implements CalendarEvent {
    id: number;
    name: string;
    startDateTime: Date;
    endDateTime: Date;

    private plausibleEventNames: string[] = [
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

    constructor(
        id: number,
        name?: string,
        startDateTime?: Date,
        endDateTime?: Date,
        endSameDay: boolean = true
    ) {
        this.id = id;
        this.name = name || this.getRandomEventName();
        this.startDateTime = startDateTime || this.getRandomStartDateTime();
        this.endDateTime = endDateTime || this.getRandomEndDateTime(endSameDay);
    }

    private getRandomEventName(): string {
        const randomIndex = Math.floor(Math.random() * this.plausibleEventNames.length);
        return this.plausibleEventNames[randomIndex];
    }

    private getRandomStartDateTime(): Date {
        const currentDateTime = new Date();

        const modayOffset = currentDateTime.getDay() > 0 ? currentDateTime.getDay() - 1 : 6; // 0 (Sunday) to 6 (Saturday)
        const randomDay = Math.floor(Math.random() * (7 + 1)); // Random day index

        const randomHour = Math.floor(Math.random() * (24)); // Random hour between 0 and 23
        // const randomQuarter = [0, 15, 30, 45][Math.floor(Math.random() * (4 + 1))]; // Random quarter (0, 15, 30, or 45)
        const randomQuarter = 0

        currentDateTime.setDate(currentDateTime.getDate() - modayOffset + randomDay);
        currentDateTime.setHours(randomHour, randomQuarter, 0, 0);
        return currentDateTime;
    }

    private getRandomEndDateTime(endSameDay: boolean): Date {
        const endDateTime = new Date(this.startDateTime);
        let randomEndDate: number;
        let randomEndHour: number;
        let randomQuarter: number;

        if (endSameDay) {
            randomEndDate = this.startDateTime.getDate();
            const startHour = this.startDateTime.getHours(); 
            randomEndHour = startHour + Math.floor(Math.random() * (24 - startHour)) + 1; // makes sure the EndHour is at least an hour later
            // randomQuarter = [0, 15, 30, 45][Math.floor(Math.random() * (4 + 1))]; // Random quarter (0, 15, 30, or 45)
            randomQuarter = 0
        } else {
            const daysUntilSunday = this.startDateTime.getDay() > 0 ? 7 - this.startDateTime.getDay() : 0;
            randomEndDate = this.startDateTime.getDate() + Math.floor(Math.random() * (daysUntilSunday + 1)); // returns the
            randomEndHour = Math.floor(Math.random() * (24));
            // randomQuarter = [0, 15, 30, 45][Math.floor(Math.random() * (4 + 1))]; // Random quarter (0, 15, 30, or 45)
            randomQuarter = 0
        }

        endDateTime.setDate(randomEndDate)
        endDateTime.setHours(randomEndHour, randomQuarter, 0, 0);
        return endDateTime;
    }

}
