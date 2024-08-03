import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CalendarEvent, Interval } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { Subscription, map } from 'rxjs';
import { CalendarDataService } from '../../services/calendar-data.service';
import { weekPositionEvents } from '../../utils/week-positioning.utils';
import {
  isFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { WeekPosEvent } from '../../models/week-positioning.models';
import { filterList } from 'src/app/core/operators/filter-list.operator';

@Component({
  selector: 'app-week-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css',
})
export class WeekContainerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) weekSpan!: Interval;

  positionedEvents: readonly WeekPosEvent[];
  dataSubscription: Subscription | undefined;

  private rows: number;

  @HostBinding('style.height.px')
  get containerHeight(): number {
    const height = (this.rows * 48) / 2;
    return height;
  }

  constructor(private calendarDataService: CalendarDataService) {
    this.positionedEvents = [];
    this.rows = 0;
  }

  ngOnInit(): void {
    this.dataSubscription = this.calendarDataService.events$
      .pipe(
        filterList(isOverlappingInterval(this.weekSpan)),
        filterList(isFullDay),
        map(weekPositionEvents(this.weekSpan)),
      )
      .subscribe({
        next: (val: readonly WeekPosEvent[]): void => {
          this.positionedEvents = val;
          this.rows = Math.max(...val.map((ev) => ev.secAxisPos.row + 1), 0);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }
}
