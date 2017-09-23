/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimeTrackingEntryService } from './time-tracking-entry.service';

describe('TimeTrackingEntryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeTrackingEntryService]
    });
  });

  it('should ...', inject([TimeTrackingEntryService], (service: TimeTrackingEntryService) => {
    expect(service).toBeTruthy();
  }));
});
