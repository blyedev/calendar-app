import { eventsOverlap } from '../calendar-event.utils';
import { getMatrixConstructor, reduceToMatrix } from './positioning.utils';
import { AdjustedEvent } from '../../models/positioning.models';
import { CalendarEvent, Interval } from '../../models/calendar.models';

describe('Positioning Utils - Matrix Functions', () => {
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

  it('should create a matrix with getMatrixConstructor', () => {
    const matrixConstructor = getMatrixConstructor(interval);
    const result = matrixConstructor([event1, event2]);
    expect(result).toBeDefined();
  });

  it('should reduce events to matrix with reduceToMatrix', () => {
    const reducer = reduceToMatrix(eventsOverlap);
    const adjustedEvent1: AdjustedEvent = {
      event: event1,
      displayInterval: interval,
    };
    const adjustedEvent2: AdjustedEvent = {
      event: event2,
      displayInterval: interval,
    };

    const result = reducer([], adjustedEvent1);
    const finalResult = reducer(result, adjustedEvent2);
    expect(finalResult).toBeDefined();
  });
});
