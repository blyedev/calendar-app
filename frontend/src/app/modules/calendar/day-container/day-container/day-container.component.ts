import { Component, Signal, inject, input } from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { CalendarDataService } from '../../services/calendar-data.service';
import { DayPosEvent } from '../../models/day-positioning.models';
import { map, switchMap } from 'rxjs';
import {
  isNonFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { dayPositionEvents } from '../../utils/day-positioning.utils';
import { EventComponent } from '../event/event.component';
import { filterList } from 'src/app/core/operators/filter-list.operator';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-day-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './day-container.component.html',
  styleUrl: './day-container.component.css',
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
