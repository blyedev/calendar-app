import { Component } from '@angular/core';
import { Calendar } from 'src/app/core/models/calendar.models';
import { CalendarAPIService } from 'src/app/core/services/calendar-api.service';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.css',
})
export class CalendarPageComponent {
  constructor(private calendarService: CalendarAPIService) {}
}
