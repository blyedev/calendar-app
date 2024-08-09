import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import { intervalOverlapsWithAny, intervalsOverlap } from './interval.utils';
import { intervalDaysOverlap } from './interval-day.utils';

export function eventsOverlap(
  event1: CalendarEvent,
  event2: CalendarEvent,
): boolean {
  return intervalsOverlap(event1, event2);
}

export function eventDaysOverlap(
  event1: CalendarEvent,
  event2: CalendarEvent,
): boolean {
  return intervalDaysOverlap(event1, event2);
}

export function calculateVisBox(interval: Interval): Interval {
  const visBoxStart = new Date(interval.start);
  const visBoxEnd = new Date(visBoxStart);
  visBoxEnd.setMinutes(visBoxEnd.getMinutes() + 45);

  return {
    start: visBoxStart,
    end: visBoxEnd,
  };
}

export function eventOverlapsWithVisBox(
  event: CalendarEvent,
  ...visBoxEvents: Interval[]
): boolean {
  return intervalOverlapsWithAny(event, ...visBoxEvents.map(calculateVisBox));
}

export const isFullDay = (event: CalendarEvent): boolean => {
  const unixDay = 1000 * 60 * 60 * 24;
  const unixTimeSpan = event.end.getTime() - event.start.getTime();

  return unixTimeSpan / unixDay >= 1;
};

export const isNonFullDay = (ev: CalendarEvent): boolean => {
  return !isFullDay(ev);
};

export const isOverlappingInterval =
  (interval: Interval) =>
  (event: CalendarEvent): boolean => {
    return intervalsOverlap(event, interval);
  };

export const compareCalendarEvents = (
  a: CalendarEvent,
  b: CalendarEvent,
): number => {
  const startComparison = a.start.getTime() - b.start.getTime();
  if (startComparison !== 0) {
    return startComparison;
  }

  const endComparison = b.end.getTime() - a.end.getTime();
  if (endComparison !== 0) {
    return endComparison;
  }

  return 0;
};
