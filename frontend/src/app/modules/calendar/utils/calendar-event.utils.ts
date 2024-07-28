import { CalendarEvent, TimeSpan } from 'src/app/core/models/calendar.models';

export function ifDaysCollide(
  event1: CalendarEvent,
  event2: CalendarEvent,
): boolean {
  const event1StartDay = new Date(event1.eventStart);
  const event1EndDay = new Date(event1.eventEnd);
  const event2StartDay = new Date(event2.eventStart);
  const event2EndDay = new Date(event2.eventEnd);

  event1StartDay.setHours(0, 0, 0, 0);
  event1EndDay.setHours(0, 0, 0, 0);
  event2StartDay.setHours(0, 0, 0, 0);
  event2EndDay.setHours(0, 0, 0, 0);

  return (
    event1EndDay.getTime() >= event2StartDay.getTime() &&
    event1StartDay.getTime() <= event2EndDay.getTime()
  );
}

export function ifEventsOverlap(
  event1: CalendarEvent,
  event2: CalendarEvent,
): boolean {
  return (
    event1.eventEnd.getTime() > event2.eventStart.getTime() &&
    event1.eventStart.getTime() < event2.eventEnd.getTime()
  );
}

export function ifEventBlocksVisualBox(
  visualBoxStart: Date,
  event2: CalendarEvent,
): boolean {
  const visBoxStart = new Date(visualBoxStart);
  const visBoxEnd = new Date(visBoxStart);
  visBoxEnd.setMinutes(visBoxEnd.getMinutes() + 45);

  return (
    visBoxEnd.getTime() > event2.eventStart.getTime() &&
    visBoxStart.getTime() < event2.eventEnd.getTime()
  );
}
export function calculateDayOffset(date1: Date, date2: Date): number {
  const unixDay = 1000 * 60 * 60 * 24;

  const day1 = new Date(date1);
  const day2 = new Date(date2);

  day1.setHours(0, 0, 0, 0);
  day2.setHours(0, 0, 0, 0);

  return (day2.getTime() - day1.getTime()) / unixDay;
}

export const filterFullDay = (event: CalendarEvent): boolean => {
  const unixDay = 1000 * 60 * 60 * 24;
  const unixTimeSpan = event.eventEnd.getTime() - event.eventStart.getTime();

  return unixTimeSpan / unixDay >= 1;
};

export const filterNonFullDay = (ev: CalendarEvent): boolean => {
  return !filterFullDay(ev);
};

export const filterToday =
  (daySpan: TimeSpan) =>
  (event: CalendarEvent): boolean => {
    return (
      daySpan.end.getTime() >= event.eventStart.getTime() &&
      daySpan.start.getTime() <= event.eventEnd.getTime()
    );
  };

export const calEventComparator = (
  a: CalendarEvent,
  b: CalendarEvent,
): number => {
  const startComparison = a.eventStart.getTime() - b.eventStart.getTime();
  if (startComparison !== 0) {
    return startComparison;
  }

  const endComparison = b.eventEnd.getTime() - a.eventEnd.getTime();
  if (endComparison !== 0) {
    return endComparison;
  }

  return 0;
};
