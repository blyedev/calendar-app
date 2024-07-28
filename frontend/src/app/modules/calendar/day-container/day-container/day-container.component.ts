import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent, TimeSpan } from 'src/app/core/models/calendar.models';
import { CalendarDataService } from '../../services/calendar-data.service';
import { DayPosEvent } from '../../models/day-positioning.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { map } from 'rxjs';
import {
  filterNonFullDay,
  filterToday,
} from '../../utils/calendar-event.utils';
import { dayPositionEvents } from '../../utils/day-positioning.utils';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-day-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './day-container.component.html',
  styleUrl: './day-container.component.css',
})
export class DayContainerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) daySpan!: TimeSpan;

  positionedEvents: readonly DayPosEvent[];
  dataSubscription: Subscription | undefined;

  constructor(private calendarDataService: CalendarDataService) {
    this.positionedEvents = [];
  }

  ngOnInit(): void {
    this.dataSubscription = this.calendarDataService.events$
      .pipe(
        map((list: CalendarEvent[]) => list.filter(filterNonFullDay)),
        map((list: CalendarEvent[]) => list.filter(filterToday(this.daySpan))),
        map((list: CalendarEvent[]) => dayPositionEvents(list, this.daySpan)),
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
