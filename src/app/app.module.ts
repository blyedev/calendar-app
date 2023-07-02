import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarCanvasComponent } from './calendarPage/calendar-canvas/calendar-canvas.component';
import { EventComponentComponent } from './calendarPage/event-component/event-component.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarCanvasComponent,
    EventComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
