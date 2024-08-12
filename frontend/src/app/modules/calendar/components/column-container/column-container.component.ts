import { Component, HostListener, Signal, inject, input } from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { filterList } from 'src/app/core/operators/filter-list.operator';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { PosEvent } from '../../models/positioning.models';
import {
  isNonFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { columnPositionEvents } from '../../utils/positioning/column-positioning.utils';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-column-container',
  standalone: true,
  imports: [EventComponent, AsyncPipe],
  templateUrl: './column-container.component.html',
  styleUrls: ['./column-container.component.css'],
})
export class ColumnContainerComponent {
  private readonly eventService = inject(EventService);
  readonly timespan = input.required<Interval>();

  readonly positionedEvents: Signal<readonly PosEvent[]>;

  constructor() {
    this.positionedEvents = toSignal(
      toObservable(this.timespan).pipe(
        switchMap((daySpan: Interval) =>
          this.eventService.events$.pipe(
            filterList(isOverlappingInterval(daySpan)),
            filterList(isNonFullDay),
            map(columnPositionEvents(daySpan)),
          ),
        ),
      ),
      { initialValue: [] },
    );
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    console.log(event);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    event.stopPropagation();
    // console.log(event);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    event.stopPropagation();
    console.log(event);
  }
}
