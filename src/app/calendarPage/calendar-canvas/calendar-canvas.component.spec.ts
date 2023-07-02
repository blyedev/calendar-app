import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCanvasComponent } from './calendar-canvas.component';

describe('CalendarCanvasComponent', () => {
  let component: CalendarCanvasComponent;
  let fixture: ComponentFixture<CalendarCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
