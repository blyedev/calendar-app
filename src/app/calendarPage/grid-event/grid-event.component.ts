import { Component, Input } from '@angular/core';
import { CalendarEvent } from '../calendar-event';

@Component({
  selector: 'app-grid-event',
  templateUrl: './grid-event.component.html',
  styleUrls: ['./grid-event.component.css']
})
export class GridEventComponent {
  @Input({ required: true }) event!: CalendarEvent;
}
