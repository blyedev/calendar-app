import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import {
  compareCalendarEvents,
  eventOverlapsWithVisBox,
  eventsOverlap,
} from './calendar-event.utils';
import { DayPartPosEvent, DayPosEvent } from '../models/day-positioning.models';
import { reduceToMatrix } from './positioning-utils';
import { ReadonlyMatrix } from '../models/positioning.models';

const addDayPrimPos =
  (weekSpan: Interval) =>
  (event: CalendarEvent): DayPartPosEvent => {
    return {
      event: event,
      primAxisPos: {
        start: new Date(
          Math.max(event.start.getTime(), weekSpan.start.getTime()),
        ),
        end: new Date(Math.min(event.end.getTime(), weekSpan.end.getTime())),
      },
    };
  };

const getLeft = (
  alreadyPositioned: ReadonlyMatrix<DayPosEvent>,
  ev: DayPartPosEvent,
  i: number,
): number => {
  if (i == 0) {
    return 0;
  }
  var x = alreadyPositioned[i - 1].filter((posEv) =>
    eventsOverlap(posEv.event, ev.event),
  );
  var y = x.filter((posEv) =>
    eventOverlapsWithVisBox(ev.event, posEv.primAxisPos),
  );

  if (y.length > 0) {
    return y[0].secAxisPos.left + y[0].secAxisPos.width;
  }

  return x[0].secAxisPos.left + 0.05;
};

const getCollidingTreeDepth = (
  parents: DayPartPosEvent[],
  i: number,
  arr: ReadonlyMatrix<DayPartPosEvent>,
): number => {
  if (i + 1 >= arr.length) {
    return 0;
  }

  const y = arr[i + 1].filter((childEv) => {
    return parents.some((ev) =>
      eventOverlapsWithVisBox(childEv.event, ev.primAxisPos),
    );
  });

  if (y.length == 0) {
    return 0;
  }

  const x = arr[i + 1].filter((childEv) => {
    return parents.some((ev) => eventsOverlap(ev.event, childEv.event));
  });

  if (x.length == 0) {
    return 0;
  }

  return getCollidingTreeDepth(x, i + 1, arr) + 1;
};

const getNonChildCollider = (
  ev: DayPartPosEvent,
  currentChildren: DayPartPosEvent[],
  i: number,
  arr: ReadonlyMatrix<DayPartPosEvent>,
): number => {
  const nonChildColliders = arr[i]
    .filter((testedEvent) => {
      return !currentChildren.some((child) => child.event == testedEvent.event);
    })
    .filter((nonChild) => eventsOverlap(ev.event, nonChild.event));

  if (nonChildColliders.length > 0) {
    return i;
  }

  if (i + 1 >= arr.length) {
    return -1;
  }

  const newChildren = arr[i + 1].filter((childEv) => {
    return currentChildren.some((event) =>
      eventsOverlap(event.event, childEv.event),
    );
  });

  if (i + 1 >= arr.length) {
    return -1;
  }

  return getNonChildCollider(ev, newChildren, i + 1, arr);
};

const getWidth = (
  alreadyPositioned: ReadonlyMatrix<DayPosEvent>,
  ev: DayPartPosEvent,
  i: number,
  arr: ReadonlyMatrix<DayPartPosEvent>,
): number => {
  var childCount = getCollidingTreeDepth([ev], i, arr);
  var nonChildColliderIndex = getNonChildCollider(ev, [ev], i, arr);
  const maxWidth =
    nonChildColliderIndex != -1
      ? (nonChildColliderIndex - i) / (arr.length - i)
      : 1;

  console.log({ nonChildI: nonChildColliderIndex, maxWidth: maxWidth });
  return (1 / (childCount + 1)) * maxWidth;
};

const testReduce = (
  acc: ReadonlyMatrix<DayPosEvent>,
  evList: ReadonlyArray<DayPartPosEvent>,
  i: number,
  arr: ReadonlyMatrix<DayPartPosEvent>,
): ReadonlyMatrix<DayPosEvent> => {
  const postionedList: ReadonlyArray<DayPosEvent> = evList.map((ev) => {
    const left = getLeft(acc, ev, i);
    const width = (1 - left) * getWidth(acc, ev, i, arr);
    return {
      ...ev,
      secAxisPos: {
        left: left,
        width: width,
        zIndex: i,
      },
    };
  });
  return [...acc, postionedList];
};

export const dayPositionEvents =
  (daySpan: Interval) =>
  (events: ReadonlyArray<CalendarEvent>): ReadonlyArray<DayPosEvent> => {
    return events
      .toSorted(compareCalendarEvents)
      .map(addDayPrimPos(daySpan))
      .reduce(reduceToMatrix<DayPartPosEvent>(eventsOverlap), [])
      .reduce(testReduce, [])
      .flat();
  };
