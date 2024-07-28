import { CalendarEvent, TimeSpan } from 'src/app/core/models/calendar.models';
import {
  calEventComparator,
  ifEventBlocksVisualBox,
  ifEventsOverlap,
} from './calendar-event.utils';
import { DayPartPosEvent, DayPosEvent } from '../models/day-positioning.models';
import { reduceToMatrix } from './positioning-utils';
import { ReadonlyMatrix } from '../models/positioning.models';

const addDayPrimPos =
  (weekSpan: TimeSpan) =>
  (event: CalendarEvent): DayPartPosEvent => {
    return {
      event: event,
      primAxisPos: {
        startTime: new Date(
          Math.max(event.eventStart.getTime(), weekSpan.start.getTime()),
        ),
        endTime: new Date(
          Math.min(event.eventEnd.getTime(), weekSpan.end.getTime()),
        ),
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
    ifEventsOverlap(posEv.event, ev.event),
  );
  var y = x.filter((posEv) =>
    ifEventBlocksVisualBox(posEv.primAxisPos.startTime, ev.event),
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
      ifEventBlocksVisualBox(ev.primAxisPos.startTime, childEv.event),
    );
  });

  if (y.length == 0) {
    return 0;
  }

  const x = arr[i + 1].filter((childEv) => {
    return parents.some((ev) => ifEventsOverlap(ev.event, childEv.event));
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
    .filter((nonChild) => ifEventsOverlap(ev.event, nonChild.event));

  if (nonChildColliders.length > 0) {
    return i;
  }

  if (i + 1 >= arr.length) {
    return -1;
  }

  const newChildren = arr[i + 1].filter((childEv) => {
    return currentChildren.some((event) =>
      ifEventsOverlap(event.event, childEv.event),
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

export const dayPositionEvents = (
  events: ReadonlyArray<CalendarEvent>,
  daySpan: TimeSpan,
): ReadonlyArray<DayPosEvent> => {
  return events
    .toSorted(calEventComparator)
    .map(addDayPrimPos(daySpan))
    .reduce(reduceToMatrix<DayPartPosEvent>(ifEventsOverlap), [])
    .reduce(testReduce, [])
    .flat();
};
