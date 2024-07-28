import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CalendarEvent, TimeSpan } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { Subscription, map } from 'rxjs';
import { CalendarDataService } from '../../services/calendar-data.service';
import { weekPositionEvents } from '../../utils/week-positioning.utils';
import { filterFullDay } from '../../utils/calendar-event.utils';
import { WeekPosEvent } from '../../models/week-positioning.models';

@Component({
  selector: 'app-week-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css',
})
export class WeekContainerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) weekSpan!: TimeSpan;

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
        map((list: CalendarEvent[]) => list.filter(filterFullDay)),
        map((list: CalendarEvent[]) => weekPositionEvents(list, this.weekSpan)),
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
