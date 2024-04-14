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
import { PositionEventsRelativePipe } from './calendarPage/day-column/position-events-relative.pipe';
import { NewEventFormComponent } from './calendarPage/new-event-form/new-event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GetNewEventPipe } from './calendarPage/day-column/get-new-event.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CalendarCanvasComponent,
    DayColumnComponent,
    WeekRowComponent,
    RelationalEventComponent,
    GridEventComponent,
    NewEventComponent,
    PositionEventsRelativePipe,
    NewEventFormComponent,
    GetNewEventPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
