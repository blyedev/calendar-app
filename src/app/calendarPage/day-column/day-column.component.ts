import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../calendar-event";
import { PositionedCalendarEvent } from "./positioned-calendar-event";
import { CalendarNode } from "./calendar-event-tree";

@Component({
  selector: 'app-day-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day-column.component.html',
  styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent {
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) { }

  @Input() events: CalendarEvent[] = [];
  @Input() dayBoundaries!: { dayStart: Date, dayEnd: Date };

  isDragging = false;
  newEventStartY = 0;
  newEventTop = 0;
  newEventHeight = 0;
  newEventEvent: CalendarEvent | undefined;

  ngOnChanges(changes: SimpleChanges) {
    console.log("Daycolumn", this.events, changes)
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation
    // console.log('Mouse down:', event);

    this.isDragging = true;
    const elementRectangle = this.el.nativeElement.getBoundingClientRect();
    this.newEventStartY = event.pageY - elementRectangle.top - window.scrollY
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      event.stopPropagation
      // console.log('Mouse move:', event);

      // get cursor position
      const elementRectangle = this.el.nativeElement.getBoundingClientRect();
      const currentY = event.pageY - elementRectangle.top - window.scrollY;

      // get coordinates
      let quarterStartIndex, quarterEndIndex;
      if (currentY >= this.newEventStartY) {
        quarterStartIndex = Math.floor(this.newEventStartY / 12)
        quarterEndIndex = Math.ceil(currentY / 12)
      } else {
        quarterStartIndex = Math.floor(currentY / 12)
        quarterEndIndex = Math.ceil(this.newEventStartY / 12)
      }

      // set event position
      this.newEventTop = quarterStartIndex * 12;
      this.newEventHeight = quarterEndIndex * 12 - this.newEventTop

      // create event content
      const eventStart = new Date(this.dayBoundaries.dayStart)
      eventStart.setMinutes(eventStart.getMinutes() + (quarterStartIndex * 15))
      const eventEnd = new Date(this.dayBoundaries.dayStart)
      eventEnd.setMinutes(eventEnd.getMinutes() + (quarterEndIndex * 15))

      this.newEventEvent = {
        id: undefined,
        name: "Untitled",
        startDateTime: eventStart,
        endDateTime: eventEnd
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    event.stopPropagation
    if (this.isDragging) {
      // Handle mouseup only if the component was actively dragging
      // console.log('Handling mouseup in the active drag component');
      // console.log('Mouse up:', event);

      this.isDragging = false;
      this.newEventStartY = 0;
      // this.newEventTop = 0;
      // this.newEventHeight = 0;

      if (this.newEventEvent) {
        // this.events.push(this.newEventEvent);
        this.newEventEvent = undefined;
      }
      // this.cdr.detectChanges();
    }
  }

  sortEvents(events: CalendarEvent[]): CalendarEvent[] {
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

  getPositionedEvents(events: CalendarEvent[]): PositionedCalendarEvent[] {
    // gets events in a nth-tree wrapper where each node is positioned on a 2d array grid
    const laidOutEvents = this.layoutEvents(events, this.sortEvents);
    // wraps events in a positioning wrapper dependant on the layout
    const positionedEvents = this.positionEvents(laidOutEvents) || []

    // return an array of events in a positioning data wrapper
    return positionedEvents
  }

  layoutEvents(events: CalendarEvent[], sortFunction: (events: CalendarEvent[]) => CalendarEvent[]): CalendarNode[][] {
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

  getFirstCollider(nodes: CalendarNode[], ev: CalendarNode): CalendarNode | null {
    const collider = nodes.find(node => this.collidesWith(node.value, ev.value));
    if (collider) {
      return collider;
    } else {
      return null
    }
  }

  positionEvents(columns: CalendarNode[][]): PositionedCalendarEvent[] {
    const nodeHeads = columns[0] || [];

    const positionedEvents: PositionedCalendarEvent[] = []
    nodeHeads.forEach((nodeHead) => {
      const positionedTree = this.positionEventAndChildren(positionedEvents, nodeHead, 0, columns, 0);

      positionedEvents.push(...positionedTree)
    })
    return positionedEvents
  }

  positionEventAndChildren(previousTrees: PositionedCalendarEvent[], node: CalendarNode, offset: number, columns: CalendarNode[][], columnsIndex: number): PositionedCalendarEvent[] {
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

  findWidthLimit(positionedEvents: PositionedCalendarEvent[], node: CalendarNode, columns: CalendarNode[][], columnsIndex: number): number {
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

  adjustDateWithinBoundaries(date: Date): Date {
    if (date < this.dayBoundaries.dayStart) {
      return new Date(this.dayBoundaries.dayStart);
    } else if (date > this.dayBoundaries.dayEnd) {
      return new Date(this.dayBoundaries.dayEnd);
    }
    return date;
  };

  collidesWithAnyNonAncestors(node: CalendarNode, parent: CalendarNode, columns: CalendarNode[][], columnsIndex: number): boolean {
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

  getMaxTreeDepth(node: CalendarNode): number {
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

  collidesWith(a: CalendarEvent, b: CalendarEvent): boolean {
    return a.endDateTime.getTime() > b.startDateTime.getTime() && a.startDateTime.getTime() < b.endDateTime.getTime();
  }

  collidesWithVisualBox(parent: CalendarEvent, child: CalendarEvent): boolean {
    const StartPlusOneHour = new Date(this.adjustDateWithinBoundaries(parent.startDateTime));
    StartPlusOneHour.setHours(StartPlusOneHour.getHours() + 2); // Add one hour to the start time of event A

    return StartPlusOneHour.getTime() > child.startDateTime.getTime() && this.collidesWith(parent, child);
  }
}