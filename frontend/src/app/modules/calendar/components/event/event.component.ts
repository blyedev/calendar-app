import { Component, HostListener, Input, inject } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar.models';
import { CalendarDataService } from '../../services/calendar-data.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  private calendarDataService: CalendarDataService =
    inject(CalendarDataService);

  @Input({ required: true }) event!: CalendarEvent;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.calendarDataService.deleteEvent(this.event.uid!);
    }
  }
}
