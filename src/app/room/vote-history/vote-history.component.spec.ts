import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteHistoryComponent } from './vote-history.component';

describe('VoteHistoryComponent', () => {
  let component: VoteHistoryComponent;
  let fixture: ComponentFixture<VoteHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
