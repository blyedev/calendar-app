import { Component, Signal, inject, input } from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { CalendarDataService } from '../../services/calendar-data.service';
import { DayPosEvent } from '../../models/day-positioning.models';
import {
  isNonFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { dayPositionEvents } from '../../utils/day-positioning.utils';
import { EventComponent } from '../event/event.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { filterList } from 'src/app/core/operators/filter-list.operator';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';

@Component({
  selector: 'app-day-container',
  standalone: true,
  imports: [EventComponent, AsyncPipe],
  templateUrl: './day-container.component.html',
  styleUrls: ['./day-container.component.css'],
})
export class DayContainerComponent {
  private readonly calendarDataService = inject(CalendarDataService);
  readonly daySpan = input.required<Interval>();

  readonly positionedEvents: Signal<readonly DayPosEvent[]>;

  constructor() {
    this.positionedEvents = toSignal(
      toObservable(this.daySpan).pipe(
        switchMap((daySpan: Interval) =>
          this.calendarDataService.events$.pipe(
            filterList(isOverlappingInterval(daySpan)),
            filterList(isNonFullDay),
            map(dayPositionEvents(daySpan)),
          ),
        ),
      ),
      { initialValue: [] },
    );
  }
}
