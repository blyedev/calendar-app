import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreationPopoverComponent } from './event-creation-popover.component';

describe('EventCreationPopoverComponent', () => {
  let component: EventCreationPopoverComponent;
  let fixture: ComponentFixture<EventCreationPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCreationPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCreationPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
