import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerCardComponent } from './poker-card.component';

describe('PokerCardComponent', () => {
  let component: PokerCardComponent;
  let fixture: ComponentFixture<PokerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokerCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
