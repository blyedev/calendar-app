import { Component, HostListener, inject, input } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from '../../models/calendar.models';

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
