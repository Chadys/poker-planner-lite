import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationDialogComponent } from './user-creation-dialog.component';

describe('RoomEnterDialogComponent', () => {
  let component: UserCreationDialogComponent;
  let fixture: ComponentFixture<UserCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
