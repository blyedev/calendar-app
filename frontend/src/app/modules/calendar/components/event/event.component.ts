import { Component, HostListener, Input, inject } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar.models';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  private eventService: EventService = inject(EventService);

  @Input({ required: true }) event!: CalendarEvent;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.eventService.deleteEvent(this.event.uid!);
    }
  }
}
