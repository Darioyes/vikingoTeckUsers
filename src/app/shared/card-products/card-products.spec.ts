import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProducts } from './card-products';

describe('CardProducts', () => {
  let component: CardProducts;
  let fixture: ComponentFixture<CardProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
