import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import { columnPositionEvents } from './column-positioning.utils';

describe('Positioning Utils', () => {
  let event1: CalendarEvent;
  let event2: CalendarEvent;
  let timespan: Interval;

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

    timespan = {
      start: new Date('2024-08-10T08:00:00'),
      end: new Date('2024-08-10T11:00:00'),
    };
  });

  it('should create columnPositionEvents', () => {
    const result = columnPositionEvents(timespan)([event1, event2]);
    expect(result).toBeDefined();
  });
});
