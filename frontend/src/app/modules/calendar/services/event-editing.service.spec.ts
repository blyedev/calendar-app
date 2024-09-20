import { TestBed } from '@angular/core/testing';

import { EventEditingService } from './event-editing.service';

describe('EventEditingService', () => {
  let service: EventEditingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventEditingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
