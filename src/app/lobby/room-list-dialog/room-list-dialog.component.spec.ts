import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomListDialogComponent } from './room-list-dialog.component';

describe('RoomCreateComponent', () => {
  let component: RoomListDialogComponent;
  let fixture: ComponentFixture<RoomListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomListDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
