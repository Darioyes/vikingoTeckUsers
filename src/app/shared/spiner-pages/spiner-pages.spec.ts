import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinerPages } from './spiner-pages';

describe('SpinerPages', () => {
  let component: SpinerPages;
  let fixture: ComponentFixture<SpinerPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinerPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinerPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
