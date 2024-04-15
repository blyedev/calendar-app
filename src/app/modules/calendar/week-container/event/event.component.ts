import { Component, Input } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar-event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  @Input({ required: true }) event!: CalendarEvent;
}
