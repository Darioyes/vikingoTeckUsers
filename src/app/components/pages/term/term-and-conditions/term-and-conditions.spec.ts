import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermAndConditions } from './term-and-conditions';

describe('TermAndConditions', () => {
  let component: TermAndConditions;
  let fixture: ComponentFixture<TermAndConditions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermAndConditions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermAndConditions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
