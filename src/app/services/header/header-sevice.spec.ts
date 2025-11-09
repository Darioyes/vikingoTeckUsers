import { TestBed } from '@angular/core/testing';

import { HeaderSevice } from './header-sevice';

describe('HeaderSevice', () => {
  let service: HeaderSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
