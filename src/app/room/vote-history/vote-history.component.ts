import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RoomStore } from '@poker/data-models';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { KeyValuePipe } from '@angular/common';
import { PokerCardComponent } from '../poker-card/poker-card.component';

@Component({
  selector: 'app-vote-history',
  standalone: true,
  imports: [MatListModule, KeyValuePipe, PokerCardComponent],
  template: `
    <div>
      <h1>History of the votes</h1>
      <mat-list>
        @for (
          roundItem of sheetData.historyVotes() | keyvalue;
          track roundItem.key
        ) {
          <mat-list-item>
            <span matListItemTitle>Round {{ roundItem.key }}</span>
            @for (voteItem of roundItem.value | keyvalue; track voteItem.key) {
              <span matListItemLine
                >{{ voteItem.key }}: {{ voteItem.value }}</span
              >
            }
          </mat-list-item>
        }
      </mat-list>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteHistoryComponent {
  readonly sheetData: RoomStore = inject(MAT_BOTTOM_SHEET_DATA);
}
