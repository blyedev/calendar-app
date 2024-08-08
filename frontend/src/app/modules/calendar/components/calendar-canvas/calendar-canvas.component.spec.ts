import { TestBed } from '@angular/core/testing';
import { CalendarCanvasComponent } from './calendar-canvas.component';
import { Component } from '@angular/core';
import { RowContainerComponent } from '../row-container/row-container.component';
import { ColumnContainerComponent } from '../column-container/column-container.component';

@Component({
  selector: 'app-column-container',
  standalone: true,
  template: '',
})
class MockColumnContainerComponent {}

@Component({
  selector: 'app-row-container',
  standalone: true,
  template: '',
})
class MockRowContainerComponent {}

describe('CalendarCanvasComponent', () => {
  let component: CalendarCanvasComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCanvasComponent],
    })
      .overrideComponent(CalendarCanvasComponent, {
        remove: {
          imports: [ColumnContainerComponent, RowContainerComponent],
        },
        add: {
          imports: [MockColumnContainerComponent, MockRowContainerComponent],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(CalendarCanvasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
