import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekContainerComponent } from './week-container/week-container.component';
import { EventComponent } from './event/event.component';



@NgModule({
  declarations: [
    WeekContainerComponent,
    EventComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WeekContainerComponent
  ]
})
export class WeekContainerModule { }
