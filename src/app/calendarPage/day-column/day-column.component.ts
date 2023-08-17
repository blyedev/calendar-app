import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../calendar-event";
import { PositionedCalendarEvent } from "./positioned-calendar-event";
import { CalendarNode } from "./calendar-event-tree";

@Component({
  selector: 'app-day-column',
  templateUrl: './day-column.component.html',
  styleUrls: ['./day-column.component.css']
})
export class DayColumnComponent implements OnInit {
  @Input() events!: CalendarEvent[];
  initialized!: boolean;

  positionedEvents: PositionedCalendarEvent[] = [];

  ngOnInit(): void {
    this.layoutEvents();
    this.initialized = true;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && changes["events"] && changes["events"].currentValue) {
      this.layoutEvents();
    }
  }

  private sortEvents(): void {
    this.events.sort((a, b) => {
      if (a.startDateTime.getTime() < b.startDateTime.getTime()) {
        return -1;
      } else if (a.startDateTime.getTime() > b.startDateTime.getTime()) {
        return 1;
      } else {
        if (a.endDateTime.getTime() < b.endDateTime.getTime()) {
          return -1;
        } else if (a.endDateTime.getTime() > b.endDateTime.getTime()) {
          return 1;
        } else {
          return a.id - b.id;
        }
      }
    });
  }
  
  layoutEvents(): void {
    const columns: CalendarNode[][] = [];
    let lastEventEnd: Date | null = null;

    this.sortEvents();
    this.events.forEach((ev: CalendarEvent) => {
      if (lastEventEnd !== null && ev.startDateTime.getTime() >= lastEventEnd.getTime()) {
        this.positionEvents(columns);

        columns.length = 0;
        lastEventEnd = null;
      }

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
          // puts event in columns
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

      if (lastEventEnd === null || ev.endDateTime > lastEventEnd) {
        lastEventEnd = ev.endDateTime;
      }
    })
    this.positionEvents(columns);
  }

  getFirstCollider(nodes: CalendarNode[], ev: CalendarNode): CalendarNode | null {
    const collider = nodes.find(node => this.collidesWith(node.value, ev.value));
    if (collider) {
      return collider;
    } else {
      return null
    }
  }

  positionEvents(columns: CalendarNode[][]): void {
    const nodeHeads = columns[0];

    for (let headIndex = 0; headIndex < nodeHeads.length; headIndex++) {
      this.positionEvent(nodeHeads[headIndex], 0, columns, 0);

    }
  }

  positionEvent(node: CalendarNode, offset: number, columns: CalendarNode[][], columnsIndex: number): void {
    let widthLimit = this.findWidthLimit(node, columns, columnsIndex)
    const elementWidth = (widthLimit - offset) / this.getMaxTreeDepth(node);

    if (node.topChildren.length === 0) {
      this.positionedEvents.push({
        ...node.value,
        position: {
          left: offset,
          width: widthLimit - offset,
          zIndex: columnsIndex
        }
      })

      node.bottomChildren.forEach((childNode) => {
        if (this.collidesWithAnyNonAncestors(childNode, node, columns, columnsIndex)) {
          this.positionEvent(childNode, offset + elementWidth, columns, columnsIndex + 1)
        } else {
          this.positionEvent(childNode, offset + 0.05, columns, columnsIndex + 1)
        }
      })

    } else {
      this.positionedEvents.push({
        ...node.value,
        position: {
          left: offset,
          width: elementWidth,
          zIndex: columnsIndex
        }
      })

      node.topChildren.forEach((childNode) => {
        this.positionEvent(childNode, offset + elementWidth, columns, columnsIndex + 1)
      })

      node.bottomChildren.forEach((childNode) => {
        if (this.collidesWithAnyNonAncestors(childNode, node, columns, columnsIndex)) {
          this.positionEvent(childNode, offset + elementWidth, columns, columnsIndex + 1)
        } else {
          this.positionEvent(childNode, offset + 0.05, columns, columnsIndex + 1)
        }
      })
    }
  }

  findWidthLimit(node: CalendarNode, columns: CalendarNode[][], columnsIndex: number): number {
    let descendants = [...node.topChildren, ...node.bottomChildren];

    for (let i = columnsIndex + 1; i < columns.length; i++) {
      const col = columns[i];

      for (const colNode of col) {
        if (!descendants.includes(colNode) && this.collidesWith(colNode.value, node.value)) {
          const positionedNode = this.positionedEvents.find((positionedEvent) => positionedEvent.id === colNode.value.id);
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

  collidesWith(a: PositionedCalendarEvent | CalendarEvent, b: PositionedCalendarEvent | CalendarEvent): boolean {
    return a.endDateTime.getTime() > b.startDateTime.getTime() && a.startDateTime.getTime() < b.endDateTime.getTime();
  }

  collidesWithVisualBox(parent: PositionedCalendarEvent | CalendarEvent, child: PositionedCalendarEvent | CalendarEvent): boolean {
    const StartPlusOneHour = new Date(parent.startDateTime);
    StartPlusOneHour.setHours(StartPlusOneHour.getHours() + 2); // Add one hour to the start time of event A

    return StartPlusOneHour.getTime() > child.startDateTime.getTime() && parent.startDateTime.getTime() < child.endDateTime.getTime() && this.collidesWith(parent, child);
  }

}
