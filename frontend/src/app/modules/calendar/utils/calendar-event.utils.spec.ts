import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import {
  calculateVisBox,
  compareCalendarEvents,
  eventDaysOverlap,
  eventOverlapsWithVisBox,
  eventsOverlap,
  isFullDay,
  isNonFullDay,
  isOverlappingInterval,
} from './calendar-event.utils';

describe('Utility Functions', () => {
  let event1: CalendarEvent;
  let event2: CalendarEvent;
  let interval: Interval;

  beforeEach(() => {
    event1 = {
      uid: '1',
      calendarUID: 'cal-1',
      summary: 'Event 1',
      description: '',
      start: new Date('2024-08-10T09:00:00'),
      end: new Date('2024-08-10T10:00:00'),
      createdAt: new Date(),
      lastModified: new Date(),
    };

    event2 = {
      uid: '2',
      calendarUID: 'cal-1',
      summary: 'Event 2',
      description: '',
      start: new Date('2024-08-10T09:30:00'),
      end: new Date('2024-08-10T10:30:00'),
      createdAt: new Date(),
      lastModified: new Date(),
    };

    interval = {
      start: new Date('2024-08-10T08:00:00'),
      end: new Date('2024-08-10T11:00:00'),
    };
  });

  it('should be created', () => {
    expect(eventsOverlap(event1, event2)).toBeDefined();
    expect(eventDaysOverlap(event1, event2)).toBeDefined();
    expect(calculateVisBox(interval)).toBeDefined();
    expect(eventOverlapsWithVisBox(event1, interval)).toBeDefined();
    expect(isFullDay(event1)).toBeDefined();
    expect(isNonFullDay(event1)).toBeDefined();
    expect(isOverlappingInterval(interval)(event1)).toBeDefined();
    expect(compareCalendarEvents(event1, event2)).toBeDefined();
  });
});
