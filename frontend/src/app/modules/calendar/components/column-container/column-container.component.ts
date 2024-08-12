import {
  Component,
  HostListener,
  Signal,
  computed,
  inject,
  input,
} from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { AsyncPipe } from '@angular/common';
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
  readonly timespan = input.required<Interval>();
  private readonly eventService = inject(EventService);

  readonly positionedEvents: Signal<readonly PosEvent[]>;

  constructor() {
    this.positionedEvents = computed(() => {
      const daySpan = this.timespan();

      const filteredEvents = this.eventService
        .events()
        .filter(isOverlappingInterval(daySpan))
        .filter(isNonFullDay);

      return columnPositionEvents(daySpan)(filteredEvents);
    });
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
