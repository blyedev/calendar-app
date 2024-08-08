import { Component, Signal, inject, input } from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { filterList } from 'src/app/core/operators/filter-list.operator';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { CalendarDataService } from '../../services/calendar-data.service';
import { PosEvent } from '../../models/positioning.models';
import {
  isNonFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { columnPositionEvents } from '../../utils/positioning/column-positioning.utils';

@Component({
  selector: 'app-column-container',
  standalone: true,
  imports: [EventComponent, AsyncPipe],
  templateUrl: './column-container.component.html',
  styleUrls: ['./column-container.component.css'],
})
export class ColumnContainerComponent {
  private readonly calendarDataService = inject(CalendarDataService);
  readonly timespan = input.required<Interval>();

  readonly positionedEvents: Signal<readonly PosEvent[]>;

  constructor() {
    this.positionedEvents = toSignal(
      toObservable(this.timespan).pipe(
        switchMap((daySpan: Interval) =>
          this.calendarDataService.events$.pipe(
            filterList(isOverlappingInterval(daySpan)),
            filterList(isNonFullDay),
            map(columnPositionEvents(daySpan)),
          ),
        ),
      ),
      { initialValue: [] },
    );
  }
}
