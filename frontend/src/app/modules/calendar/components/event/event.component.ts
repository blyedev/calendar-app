import { Component, HostListener, inject, input } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar.models';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event',
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  private eventService: EventService = inject(EventService);
  readonly event = input.required<CalendarEvent>();

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.eventService.deleteEvent(this.event().uid!);
    }
  }
}
