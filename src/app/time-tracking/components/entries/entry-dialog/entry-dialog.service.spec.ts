/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EntryDialogService } from './entry-dialog.service';

describe('EntryDialogServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntryDialogService]
    });
  });

  it('should ...', inject([EntryDialogService], (service: EntryDialogService) => {
    expect(service).toBeTruthy();
  }));
});
