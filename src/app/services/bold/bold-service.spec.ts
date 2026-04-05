import { TestBed } from '@angular/core/testing';

import { BoldService } from './bold-service';

describe('BoldService', () => {
  let service: BoldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
