import { TestBed } from '@angular/core/testing';

import { NavbarMenu } from './navbar-menu';

describe('NavbarMenu', () => {
  let service: NavbarMenu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarMenu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
