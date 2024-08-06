import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import { eventOverlapsWithVisBox, eventsOverlap } from './calendar-event.utils';
import { getMatrixConstructor } from './positioning-utils';
import {
  AdjustEventFunction,
  AdjustedEvent,
  MatrixPosEvent,
  PosEvent,
  ReadonlyMatrix,
} from '../models/positioning.models';
import { adjustInterval, calculateUnixDuration } from './interval.utils';
import { timestamp } from 'rxjs';

export const adjustEvent: AdjustEventFunction = (interval) => (event) => ({
  event: event,
  displayInterval: adjustInterval(interval, event),
});
const getLeft = (
  alreadyPositioned: ReadonlyMatrix<PosEvent>,
  ev: AdjustedEvent,
  i: number,
): number => {
  if (i == 0) {
    return 0;
  }
  var x = alreadyPositioned[i - 1].filter((posEv) =>
    eventsOverlap(posEv.event, ev.event),
  );
  var y = x.filter((posEv) =>
    eventOverlapsWithVisBox(ev.event, posEv.displayInterval),
  );

  if (y.length > 0) {
    return y[0].horizontal.left + y[0].horizontal.width;
  }

  return x[0].horizontal.left + 0.05;
};

const getCollidingTreeDepth = (
  parents: AdjustedEvent[],
  i: number,
  arr: ReadonlyMatrix<AdjustedEvent>,
): number => {
  if (i + 1 >= arr.length) {
    return 0;
  }

  const y = arr[i + 1].filter((childEv) => {
    return parents.some((ev) =>
      eventOverlapsWithVisBox(childEv.event, ev.displayInterval),
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
  ev: AdjustedEvent,
  currentChildren: AdjustedEvent[],
  i: number,
  arr: ReadonlyMatrix<AdjustedEvent>,
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
  alreadyPositioned: ReadonlyMatrix<PosEvent>,
  ev: AdjustedEvent,
  i: number,
  arr: ReadonlyMatrix<AdjustedEvent>,
): number => {
  var childCount = getCollidingTreeDepth([ev], i, arr);
  var nonChildColliderIndex = getNonChildCollider(ev, [ev], i, arr);
  const maxWidth =
    nonChildColliderIndex != -1
      ? (nonChildColliderIndex - i) / (arr.length - i)
      : 1;

  return (1 / (childCount + 1)) * maxWidth;
};

const getVerticalPos = (
  ev: MatrixPosEvent,
  timespan: Interval,
): { top: number; height: number } => {
  return {
    top:
      (48 *
        Math.round(
          calculateUnixDuration({
            start: timespan.start,
            end: ev.displayInterval.start,
          }) / 60000,
        )) /
      60,
    height:
      (48 * Math.round(calculateUnixDuration(ev.displayInterval) / 60000)) / 60,
  };
};

const testReduce =
  (timespan: Interval) =>
  (
    acc: ReadonlyMatrix<PosEvent>,
    evList: ReadonlyArray<MatrixPosEvent>,
    i: number,
    arr: ReadonlyMatrix<MatrixPosEvent>,
  ): ReadonlyMatrix<PosEvent> => {
    const postionedList: ReadonlyArray<PosEvent> = evList.map((ev) => {
      const left = getLeft(acc, ev, i);
      const width = (1 - left) * getWidth(acc, ev, i, arr);
      return {
        ...ev,
        horizontal: {
          left: left,
          width: width,
        },
        vertical: getVerticalPos(ev, timespan),
      };
    });
    return [...acc, postionedList];
  };

export const columnPositionEvents =
  (timespan: Interval) =>
  (events: ReadonlyArray<CalendarEvent>): ReadonlyArray<PosEvent> => {
    const constructRowMatrix = getMatrixConstructor(timespan);

    const matrix = constructRowMatrix(events);

    return matrix.reduce(testReduce(timespan), []).flat();
  };
