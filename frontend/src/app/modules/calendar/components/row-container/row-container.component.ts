import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { Subscription, map } from 'rxjs';
import { filterList } from 'src/app/core/operators/filter-list.operator';
import { PosEvent } from '../../models/positioning.models';
import { CalendarDataService } from '../../services/calendar-data.service';
import {
  isFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { gridPositionEvents } from '../../utils/positioning/row-positioning.utils';

@Component({
  selector: 'app-row-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './row-container.component.html',
  styleUrl: './row-container.component.css',
})
export class RowContainerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) timespan!: Interval;

  positionedEvents: readonly PosEvent[];
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
        filterList(isOverlappingInterval(this.timespan)),
        filterList(isFullDay),
        map(gridPositionEvents(this.timespan)),
      )
      .subscribe({
        next: (val: readonly PosEvent[]): void => {
          this.positionedEvents = val;
          this.rows = Math.max(...val.map((ev) => ev.layer + 1), 0);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }
}
