import { TestBed } from '@angular/core/testing';
import { CalendarPageComponent } from './calendar-page.component';
import { CalendarCanvasComponent } from './components/calendar-canvas/calendar-canvas.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-canvas',
  standalone: true,
  template: '',
})
class MockCalendarCanvasComponent {}

describe('CalendarPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarPageComponent],
    })
      .overrideComponent(CalendarPageComponent, {
        remove: { imports: [CalendarCanvasComponent] },
        add: { imports: [MockCalendarCanvasComponent] },
      })
      .compileComponents();
  });

  it('should create the CalendarPageComponent', () => {
    const fixture = TestBed.createComponent(CalendarPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
