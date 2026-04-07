import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseOfCookies } from './use-of-cookies';

describe('UseOfCookies', () => {
  let component: UseOfCookies;
  let fixture: ComponentFixture<UseOfCookies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UseOfCookies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseOfCookies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
