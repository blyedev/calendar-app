import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
} from '@angular/core';
import { Interval } from 'src/app/core/models/calendar.models';
import { EventComponent } from '../event/event.component';
import { AsyncPipe } from '@angular/common';
import {
  isNonFullDay,
  isOverlappingInterval,
} from '../../utils/calendar-event.utils';
import { columnPositionEvents } from '../../utils/positioning/column-positioning.utils';
import { EventService } from '../../services/event.service';
import { EventCreationService } from '../../services/event-creation.service';

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
  private readonly eventCreationService = inject(EventCreationService);
  private readonly el = inject(ElementRef);

  readonly positionedEvents = computed(() => {
    const daySpan = this.timespan();

    const filteredEvents = this.eventService
      .events()
      .filter(isOverlappingInterval(daySpan))
      .filter(isNonFullDay);

    return columnPositionEvents(daySpan)(filteredEvents);
  });

  private mouseDownY: number | null = null;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      event.stopPropagation();

      const elementRectangle = this.el.nativeElement.getBoundingClientRect();
      this.mouseDownY = event.pageY - elementRectangle.top - window.scrollY;

      console.log('Mouse down at:', this.mouseDownY);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (event.buttons & (1 << 0)) {
      event.stopPropagation();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (event.button === 0 && this.mouseDownY !== null) {
      event.stopPropagation();

      const elementRectangle = this.el.nativeElement.getBoundingClientRect();
      const mouseUpY = event.pageY - elementRectangle.top - window.scrollY;

      console.log('Mouse up at:', mouseUpY);

      const mDownTime = this.calculateTimeFromY(this.mouseDownY);
      const mUpTime = this.calculateTimeFromY(mouseUpY);

      const newTimespan: Interval = {
        start: mDownTime <= mUpTime ? mDownTime : mUpTime,
        end: mDownTime <= mUpTime ? mUpTime : mDownTime,
      };

      this.eventCreationService.initCreating(newTimespan);

      this.mouseDownY = null;
    }
    this.mouseDownY = null;
  }

  private calculateTimeFromY(yPosition: number): Date {
    const hoursFromStart = yPosition / 48; // Assuming 48px per hour
    const minutesFromStart = hoursFromStart * 60;

    const startTime = this.timespan().start;
    const calculatedTime = new Date(
      startTime.getTime() + minutesFromStart * 60000,
    );

    return calculatedTime;
  }
}
