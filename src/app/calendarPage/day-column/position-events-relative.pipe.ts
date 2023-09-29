import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from '../calendar-event';
import { CalendarNode } from './calendar-event-tree';
import { PositionedCalendarEvent } from './positioned-calendar-event';

@Pipe({
  name: 'positionEventsRelative'
})
export class PositionEventsRelativePipe implements PipeTransform {
  dayBoundaries!: { dayStart: Date; dayEnd: Date; };

  transform(events: CalendarEvent[], dayBoundaries: { dayStart: Date, dayEnd: Date }): PositionedCalendarEvent[] {

    this.dayBoundaries = dayBoundaries;
    // gets events in a nth-tree wrapper where each node is positioned on a 2d array grid
    const laidOutEvents = this.layoutEvents(events, this.sortEvents);
    // wraps events in a positioning wrapper dependant on the layout
    const positionedEvents = this.positionEvents(laidOutEvents) || []

    // return an array of events in a positioning data wrapper
    return positionedEvents
  }

  private sortEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.sort((a, b) => {
      // sorts by which event is earlier
      const startComparison = a.startDateTime.getTime() - b.startDateTime.getTime();
      if (startComparison !== 0) {
        return startComparison;
      }

      // sorts by which event is longer
      const endComparison = b.endDateTime.getTime() - a.endDateTime.getTime();
      if (endComparison !== 0) {
        return endComparison;
      }

      // fallback
      return 0;
    });
  }

  private layoutEvents(events: CalendarEvent[], sortFunction: (events: CalendarEvent[]) => CalendarEvent[]): CalendarNode[][] {
    // Use the sorting this algorith is dependant on
    const sortedEvents = sortFunction(events);

    // places each event in columns
    const columns: CalendarNode[][] = [];
    sortedEvents.forEach((ev: CalendarEvent) => {
      // places the event in a relational object wrapper in existing columns if theres room
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        // check if event fits in the current column
        if (!this.collidesWith(col[col.length - 1].value, ev)) {
          const calNode = new CalendarNode(ev)

          // sets event's parent
          if (i > 0) {
            const parentNode = this.getFirstCollider(columns[i - 1], calNode)!
            if (this.collidesWithVisualBox(parentNode.value, calNode.value)) {
              parentNode.topChildren.push(calNode)
            } else {
              parentNode.bottomChildren.push(calNode)
            }
          }

          // puts event in column
          col.push(calNode);
          // ends positioning
          placed = true;
          break;
        }
      }

      if (!placed) {
        const calNode = new CalendarNode(ev)

        if (columns.length > 0) {
          const parentNode = this.getFirstCollider(columns[columns.length - 1], calNode)!
          if (this.collidesWithVisualBox(parentNode.value, calNode.value)) {
            parentNode.topChildren.push(calNode)
          } else {
            parentNode.bottomChildren.push(calNode)
          }
        }

        columns.push([calNode]);
      }
    })

    return columns
  }

  private getFirstCollider(nodes: CalendarNode[], ev: CalendarNode): CalendarNode | null {
    const collider = nodes.find(node => this.collidesWith(node.value, ev.value));
    if (collider) {
      return collider;
    } else {
      return null
    }
  }

  private positionEvents(columns: CalendarNode[][]): PositionedCalendarEvent[] {
    const nodeHeads = columns[0] || [];

    const positionedEvents: PositionedCalendarEvent[] = []
    nodeHeads.forEach((nodeHead) => {
      const positionedTree = this.positionEventAndChildren(positionedEvents, nodeHead, 0, columns, 0);

      positionedEvents.push(...positionedTree)
    })
    return positionedEvents
  }

  private positionEventAndChildren(previousTrees: PositionedCalendarEvent[], node: CalendarNode, offset: number, columns: CalendarNode[][], columnsIndex: number): PositionedCalendarEvent[] {
    let widthLimit = this.findWidthLimit(previousTrees, node, columns, columnsIndex);
    const elementWidth = (widthLimit - offset) / this.getMaxTreeDepth(node);

    const positionedEvents: PositionedCalendarEvent[] = [];

    // Function to adjust the date within day boundaries

    if (node.topChildren.length === 0) {
      positionedEvents.push({
        value: node.value,
        position: {
          startDateTime: this.adjustDateWithinBoundaries(node.value.startDateTime),
          endDateTime: this.adjustDateWithinBoundaries(node.value.endDateTime),
          left: offset,
          width: widthLimit,
          zIndex: columnsIndex
        }
      });

      node.bottomChildren.forEach((childNode) => {
        if (this.collidesWithAnyNonAncestors(childNode, node, columns, columnsIndex)) {
          positionedEvents.push(...this.positionEventAndChildren([...previousTrees, ...positionedEvents], childNode, offset + elementWidth, columns, columnsIndex + 1));
        } else {
          positionedEvents.push(...this.positionEventAndChildren([...previousTrees, ...positionedEvents], childNode, offset + 0.05, columns, columnsIndex + 1));
        }
      });

    } else {
      positionedEvents.push({
        value: node.value,
        position: {
          startDateTime: this.adjustDateWithinBoundaries(node.value.startDateTime),
          endDateTime: this.adjustDateWithinBoundaries(node.value.endDateTime),
          left: offset,
          width: elementWidth,
          zIndex: columnsIndex
        }
      });

      node.topChildren.forEach((childNode) => {
        positionedEvents.push(...this.positionEventAndChildren([...previousTrees, ...positionedEvents], childNode, offset + elementWidth, columns, columnsIndex + 1));
      });

      node.bottomChildren.forEach((childNode) => {
        if (this.collidesWithAnyNonAncestors(childNode, node, columns, columnsIndex)) {
          positionedEvents.push(...this.positionEventAndChildren([...previousTrees, ...positionedEvents], childNode, offset + elementWidth, columns, columnsIndex + 1));
        } else {
          positionedEvents.push(...this.positionEventAndChildren([...previousTrees, ...positionedEvents], childNode, offset + 0.05, columns, columnsIndex + 1));
        }
      });
    }

    return positionedEvents;
  }

  private findWidthLimit(positionedEvents: PositionedCalendarEvent[], node: CalendarNode, columns: CalendarNode[][], columnsIndex: number): number {
    let descendants = [...node.topChildren, ...node.bottomChildren];

    for (let i = columnsIndex + 1; i < columns.length; i++) {
      const col = columns[i];

      for (const colNode of col) {
        if (!descendants.includes(colNode) && this.collidesWith(colNode.value, node.value)) {
          const positionedNode = positionedEvents.find((positionedEvent) => positionedEvent.value.id === colNode.value.id);
          if (positionedNode) {
            return positionedNode.position.left;
          }
        }
      }

      const nextGeneration: CalendarNode[] = [];
      descendants.forEach((childNode: CalendarNode) => {
        nextGeneration.push(...childNode.topChildren, ...childNode.bottomChildren);
      });
      descendants = nextGeneration;
    }

    return 1;
  }

  private adjustDateWithinBoundaries(date: Date): Date {
    if (date < this.dayBoundaries.dayStart) {
      return new Date(this.dayBoundaries.dayStart);
    } else if (date > this.dayBoundaries.dayEnd) {
      return new Date(this.dayBoundaries.dayEnd);
    }
    return date;
  };

  private collidesWithAnyNonAncestors(node: CalendarNode, parent: CalendarNode, columns: CalendarNode[][], columnsIndex: number): boolean {
    let ancestor = node;
    for (let i = columnsIndex; i >= 0; i--) {
      const col = columns[i];
      ancestor = col.find((potentialParent: CalendarNode) => potentialParent.topChildren.includes(ancestor!) || potentialParent.bottomChildren.includes(ancestor!))!;

      for (const colNode of col) {
        if (colNode !== ancestor && this.collidesWithVisualBox(colNode.value, node.value)) {
          if (this.collidesWithVisualBox(colNode.value, parent.value)) {
            return false
          }
          return true
        }
      }
    }
    return false;
  }

  private getMaxTreeDepth(node: CalendarNode): number {
    if (!node) {
      return 0;
    }

    let maxDepth = 0;

    // Traverse top children
    for (const child of node.topChildren) {
      const depth = this.getMaxTreeDepth(child);
      maxDepth = Math.max(maxDepth, depth);
    }

    // Traverse bottom children
    for (const child of node.bottomChildren) {
      const depth = this.getMaxTreeDepth(child);
      maxDepth = Math.max(maxDepth, depth);
    }

    // Add 1 to account for the current node
    return maxDepth + 1;
  }

  private collidesWith(a: CalendarEvent, b: CalendarEvent): boolean {
    return a.endDateTime.getTime() > b.startDateTime.getTime() && a.startDateTime.getTime() < b.endDateTime.getTime();
  }

  private collidesWithVisualBox(parent: CalendarEvent, child: CalendarEvent): boolean {
    const StartPlusOneHour = new Date(this.adjustDateWithinBoundaries(parent.startDateTime));
    StartPlusOneHour.setHours(StartPlusOneHour.getHours() + 2); // Add one hour to the start time of event A

    return StartPlusOneHour.getTime() > child.startDateTime.getTime() && this.collidesWith(parent, child);
  }

}
