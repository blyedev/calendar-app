import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetCreatedEventPipe } from './day-container/get-created-event.pipe';
import { DayContainerComponent } from './day-container/day-container.component';
import { PositionEventsPipe } from './day-container/position-events.pipe';
import { EventComponent } from './event/event.component';
import { DrawnEventComponent } from './drawn-event/drawn-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventCreationService } from './event-creation.service';
import { EventCreationModalComponent } from './event-creation-modal/event-creation-modal.component';
import { IsWithinDayBoundsPipe } from './day-container/is-within-day-bounds.pipe';



@NgModule({
  declarations: [
    DayContainerComponent,
    PositionEventsPipe,
    GetCreatedEventPipe,
    EventComponent,
    DrawnEventComponent,
    EventCreationModalComponent,
    IsWithinDayBoundsPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    EventCreationService
  ],
  exports: [
    DayContainerComponent
  ]
})
export class DayContainerModule { }
