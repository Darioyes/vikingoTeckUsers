import { TestBed } from '@angular/core/testing';

import { CategoriesProducts } from './categories-products';

describe('CategoriesProducts', () => {
  let service: CategoriesProducts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesProducts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
