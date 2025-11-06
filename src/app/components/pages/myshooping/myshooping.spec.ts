import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myshooping } from './myshooping';

describe('Myshooping', () => {
  let component: Myshooping;
  let fixture: ComponentFixture<Myshooping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myshooping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myshooping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
