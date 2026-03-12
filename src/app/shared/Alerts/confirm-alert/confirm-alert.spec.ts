import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAlert } from './confirm-alert';

describe('ConfirmAlert', () => {
  let component: ConfirmAlert;
  let fixture: ComponentFixture<ConfirmAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
