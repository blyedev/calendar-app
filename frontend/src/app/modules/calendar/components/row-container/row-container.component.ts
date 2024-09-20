import {
  Component,
  HostBinding,
  Signal,
  computed,
  inject,
  input,
} from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { PosEvent } from '../../models/positioning.models';
import {
  isFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { gridPositionEvents } from '../../utils/positioning/row-positioning.utils';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-row-container',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './row-container.component.html',
  styleUrls: ['./row-container.component.css'],
})
export class RowContainerComponent {
  readonly timespan = input.required<Interval>();
  private readonly eventService = inject(EventService);
  readonly positionedEvents: Signal<readonly PosEvent[]>;
  readonly rows: Signal<number>;

  @HostBinding('style.height.px')
  get containerHeight(): number {
    const height = (this.rows() * 48) / 2;
    return height;
  }

  constructor() {
    this.positionedEvents = computed(() => {
      const daySpan = this.timespan();

      const filteredEvents = this.eventService
        .events()
        .filter(isOverlappingInterval(daySpan))
        .filter(isFullDay);

      return gridPositionEvents(daySpan)(filteredEvents);
    });

    this.rows = computed(() => {
      const events = this.positionedEvents();
      return Math.max(...events.map((ev) => ev.layer + 1), 0);
    });
  }
}
