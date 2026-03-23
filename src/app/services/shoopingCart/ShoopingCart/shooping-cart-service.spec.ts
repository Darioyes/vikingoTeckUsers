import { TestBed } from '@angular/core/testing';

import { ShoopingCartService } from './shooping-cart-service';

describe('ShoopingCartService', () => {
  let service: ShoopingCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoopingCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
