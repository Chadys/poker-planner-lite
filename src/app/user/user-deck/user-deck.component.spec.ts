import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeckComponent } from './user-deck.component';

describe('UserDeckComponent', () => {
  let component: UserDeckComponent;
  let fixture: ComponentFixture<UserDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeckComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
