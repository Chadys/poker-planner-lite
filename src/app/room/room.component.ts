import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserCreationDialogComponent } from '../user/user-creation-dialog/user-creation-dialog.component';
import {
  RoomStore,
  UserStore,
  VoteChoice,
  voteChoices,
} from '@poker/data-models';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import {
  MatAnchor,
  MatButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserProfileComponent } from '../user/user-profile/user-profile.component';
import { ShareRoomComponent } from './share-room/share-room.component';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PokerCardComponent } from './poker-card/poker-card.component';
import { VoteHistoryComponent } from './vote-history/vote-history.component';

@Component({
  selector: 'app-room',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    MatButton,
    MatAnchor,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatProgressSpinner,
    PokerCardComponent,
    KeyValuePipe,
  ],
  template: `
    <div class="p-4">
      <div class="flex w-full justify-between">
        <a mat-stroked-button href="/lobby">
          <mat-icon>home</mat-icon> Back to lobby
        </a>

        <div class="text-center">
          <h1>Room {{ roomName() }}</h1>
          <h4>Current round: {{ roomStore.currentRoom().currentRound }}</h4>
        </div>

        <div class="flex gap-3">
          <button
            mat-mini-fab
            color="primary"
            matTooltip="User info"
            aria-label="Button to open user info"
            (click)="openBottomSheet('USER')">
            <mat-icon>person</mat-icon>
          </button>
          <button
            mat-mini-fab
            color="primary"
            matTooltip="Open vote history"
            aria-label="Button to open vote history"
            (click)="openBottomSheet('HISTORY')">
            <mat-icon>history</mat-icon>
          </button>
          <button
            mat-mini-fab
            color="accent"
            matTooltip="Open sharing options"
            aria-label="Button to open sharing options"
            (click)="openBottomSheet('SHARE')">
            <mat-icon>ios_share</mat-icon>
          </button>
        </div>
      </div>

      @if (!roomStore.currentPlayers().length) {
        <mat-card
          tabindex="-1"
          class="fixed z-50 w-[calc(100%-2rem)] -translate-x-1/2 lg:max-w-7xl left-1/2 top-6">
          <mat-card-content class="bg-gray-100">
            <div class="flex flex-row justify-between items-center">
              <span>This room has no player yet</span>
              <button
                mat-flat-button
                color="accent"
                (click)="openBottomSheet('SHARE')">
                <mat-icon>ios_share</mat-icon> Share it
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      }
      <div class="relative w-min">
        <mat-progress-spinner
          [color]="timerColor()"
          mode="determinate"
          [value]="timerValue()">
          test
        </mat-progress-spinner>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mat-headline-4">
          {{ timerValue() }}
        </div>
      </div>
      <div class="flex gap-1 place-content-center">
        @for (item of roomStore.currentVotes() | keyvalue; track item.key) {
          <div class="flex flex-col">
            <app-poker-card [content]="item.value"></app-poker-card>
            <span class="text-center">{{ item.key }}</span>
          </div>
        }
      </div>
      <p>votes: {{ roomStore.currentRoom().votePerRoundPerPlayer | json }}</p>
      <p>players: {{ roomStore.currentPlayers() | json }}</p>
      <div class="flex gap-1 place-content-center">
        @for (voteOption of voteChoices; track voteOption) {
          <button mat-flat-button color="primary" (click)="vote(voteOption)">
            {{ voteOption }}
          </button>
        }
      </div>
    </div>
  `,
  styles: ``,
  providers: [RoomStore, UserStore],
})
export class RoomComponent {
  roomName = input.required<string>();
  readonly roomStore = inject(RoomStore);
  readonly userStore = inject(UserStore);
  readonly dialog = inject(MatDialog);
  readonly bottomSheet = inject(MatBottomSheet);

  timerValue: WritableSignal<number> = signal(70);
  timerColor: Signal<string> = computed(() =>
    this.timerValue() < 30 ? 'warn' : 'primary'
  );

  constructor() {
    this.roomStore.getOne(this.roomName);
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(UserCreationDialogComponent, {
      disableClose: true,
      data: { roomStore: this.roomStore, userStore: this.userStore },
      maxHeight: '80vh',
    });
  }

  openBottomSheet(sheetType: 'USER' | 'SHARE' | 'HISTORY') {
    const panelClass = ['h-4/5'];
    if (sheetType == 'USER') {
      this.bottomSheet.open(UserProfileComponent, {
        data: this.userStore,
        panelClass,
      });
      return;
    }
    if (sheetType == 'SHARE') {
      this.bottomSheet.open(ShareRoomComponent, {
        data: this.roomName,
        panelClass,
      });
      return;
    }
    if (sheetType == 'HISTORY') {
      this.bottomSheet.open(VoteHistoryComponent, {
        data: this.roomStore,
        panelClass,
      });
      return;
    }
  }

  vote(voteOption: VoteChoice) {
    this.roomStore.vote(
      this.roomStore.currentRoom(),
      this.userStore.user(),
      voteOption
    );
  }

  protected readonly voteChoices = voteChoices;
}
