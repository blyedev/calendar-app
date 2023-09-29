import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarCanvasComponent } from './calendarPage/calendar-canvas/calendar-canvas.component';
import { DayColumnComponent } from './calendarPage/day-column/day-column.component';
import { WeekRowComponent } from './calendarPage/week-row/week-row.component';
import { RelationalEventComponent } from './calendarPage/relational-event/relational-event.component';
import { GridEventComponent } from './calendarPage/grid-event/grid-event.component';
import { HttpClientModule } from '@angular/common/http';
import { NewEventComponent } from './calendarPage/new-event/new-event.component';
import { FullDayEventsPipe } from './calendarPage/calendar-canvas/full-day-events.pipe';
import { ShortEventsByDayPipe } from './calendarPage/calendar-canvas/short-events-by-day.pipe';
import { StringToDatePipe } from './calendarPage/calendar-canvas/string-to-date.pipe';
import { DayBoundsPipe } from './calendarPage/calendar-canvas/day-bounds.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CalendarCanvasComponent,
    DayColumnComponent,
    WeekRowComponent,
    RelationalEventComponent,
    GridEventComponent,
    NewEventComponent,
    FullDayEventsPipe,
    ShortEventsByDayPipe,
    StringToDatePipe,
    DayBoundsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
