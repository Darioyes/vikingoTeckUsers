import { TestBed } from '@angular/core/testing';

import { LoggeInService } from './logge-in-service';

describe('LoggeInService', () => {
  let service: LoggeInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggeInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
