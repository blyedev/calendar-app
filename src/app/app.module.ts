import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarCanvasComponent } from './calendarPage/calendar-canvas/calendar-canvas.component';
import { EventComponentComponent } from './calendarPage/event-component/event-component.component';
import { DayColumnComponent } from './calendarPage/day-column/day-column.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarCanvasComponent,
    EventComponentComponent,
    DayColumnComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
