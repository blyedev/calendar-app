import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent {
  @Input() event!: {
    name: string,
    startDateTime: Date,
    endDateTime: Date
  };
}

