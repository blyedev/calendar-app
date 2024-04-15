import { Component, Input } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar-event';

@Component({
  selector: 'app-drawn-event',
  templateUrl: './drawn-event.component.html',
  styleUrls: ['./drawn-event.component.css']
})
export class DrawnEventComponent {
  @Input({ required: true }) event!: CalendarEvent;
}

