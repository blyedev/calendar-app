import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { CalendarDataService } from '../../services/calendar-data.service';
import { DayPosEvent } from '../../models/day-positioning.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { map } from 'rxjs';
import {
  isNonFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { dayPositionEvents } from '../../utils/day-positioning.utils';
import { EventComponent } from '../event/event.component';
import { filterList } from 'src/app/core/operators/filter-list.operator';

@Component({
  selector: 'app-day-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './day-container.component.html',
  styleUrl: './day-container.component.css',
})
export class DayContainerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) daySpan!: Interval;

  positionedEvents: readonly DayPosEvent[];
  dataSubscription: Subscription | undefined;

  constructor(private calendarDataService: CalendarDataService) {
    this.positionedEvents = [];
  }

  ngOnInit(): void {
    this.dataSubscription = this.calendarDataService.events$
      .pipe(
        filterList(isOverlappingInterval(this.daySpan)),
        filterList(isNonFullDay),
        map(dayPositionEvents(this.daySpan)),
      )
      .subscribe({
        next: (val: readonly DayPosEvent[]): void => {
          this.positionedEvents = val;
        },
      });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }
}
