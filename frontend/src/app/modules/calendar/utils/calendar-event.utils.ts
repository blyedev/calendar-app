import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import {
  intervalDaysOverlap,
  intervalOverlapsWithAny,
  intervalsOverlap,
} from './interval.utils';

export function eventsOverlap(...events: CalendarEvent[]): boolean {
  return intervalsOverlap(...events);
}

export function eventDaysOverlap(...events: CalendarEvent[]): boolean {
  return intervalDaysOverlap(...events);
}

export function getVisBox(interval: Interval): Interval {
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
  return intervalOverlapsWithAny(event, ...visBoxEvents.map(getVisBox));
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
