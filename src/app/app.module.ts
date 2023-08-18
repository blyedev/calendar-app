import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarCanvasComponent } from './calendarPage/calendar-canvas/calendar-canvas.component';
import { DayColumnComponent } from './calendarPage/day-column/day-column.component';
import { WeekRowComponent } from './calendarPage/week-row/week-row.component';
import { RelationalEventComponent } from './calendarPage/relational-event/relational-event.component';
import { GridEventComponent } from './calendarPage/grid-event/grid-event.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarCanvasComponent,
    DayColumnComponent,
    WeekRowComponent,
    RelationalEventComponent,
    GridEventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
