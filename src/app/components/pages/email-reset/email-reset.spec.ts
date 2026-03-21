import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReset } from './email-reset';

describe('EmailReset', () => {
  let component: EmailReset;
  let fixture: ComponentFixture<EmailReset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailReset]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailReset);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
