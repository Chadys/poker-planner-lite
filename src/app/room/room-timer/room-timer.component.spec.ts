import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTimerComponent } from './room-timer.component';

describe('RoomTimerComponent', () => {
  let component: RoomTimerComponent;
  let fixture: ComponentFixture<RoomTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomTimerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
