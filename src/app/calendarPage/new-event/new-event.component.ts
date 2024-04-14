import { Component, Input } from '@angular/core';
import { CalendarEvent } from '../calendar-event';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent {
  @Input({ required: true }) event!: CalendarEvent;
}

