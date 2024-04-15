import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetCreatedEventPipe } from './day-container/get-created-event.pipe';
import { DayContainerComponent } from './day-container/day-container.component';
import { PositionEventsPipe } from './day-container/position-events.pipe';
import { EventComponent } from './event/event.component';
import { DrawnEventComponent } from './drawn-event/drawn-event.component';
import { CreateEventModalComponent } from './create-event-modal/create-event-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DayContainerComponent,
    PositionEventsPipe,
    GetCreatedEventPipe,
    EventComponent,
    DrawnEventComponent,
    CreateEventModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    DayContainerComponent
  ]
})
export class DayContainerModule { }
