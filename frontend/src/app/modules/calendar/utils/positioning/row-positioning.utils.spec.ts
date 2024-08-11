import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import { gridPositionEvents } from './row-positioning.utils';

describe('Grid Position Events', () => {
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

  it('should execute gridPositionEvents without errors', () => {
    const result = gridPositionEvents(interval)([event1, event2]);
    expect(result).toBeDefined();
  });
});
