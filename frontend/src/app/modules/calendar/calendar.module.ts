import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCanvasComponent } from './calendar-canvas/calendar-canvas.component';
import { DayContainerModule } from './day-container/day-container.module';
import { WeekContainerModule } from './week-container/week-container.module';



@NgModule({
  declarations: [
    CalendarCanvasComponent,
  ],
  imports: [
    CommonModule,
    DayContainerModule,
    WeekContainerModule,
  ],
  exports: [
    CalendarCanvasComponent,
  ]
})
export class CalendarModule { }
