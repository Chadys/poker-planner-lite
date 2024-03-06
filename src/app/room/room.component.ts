import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserCreationDialogComponent } from '../user/user-creation-dialog/user-creation-dialog.component';
import {
  RoomStore,
  UserStore,
  VoteChoice,
  voteChoices,
} from '@poker/data-models';
import { JsonPipe } from '@angular/common';
import {
  MatAnchor,
  MatButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserProfileComponent } from '../user/user-profile/user-profile.component';
import { ShareRoomComponent } from './share-room/share-room.component';

@Component({
  selector: 'app-room',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    MatButton,
    MatAnchor,
    MatListItem,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
  ],
  template: `
    <div class="p-4">
      <div class="flex w-full justify-between">
        <a mat-stroked-button href="/lobby">
          <mat-icon>home</mat-icon> Back to lobby
        </a>

        <h1>Room {{ roomName() }}</h1>

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
            matTooltip="Open sharing options"
            aria-label="Button to open sharing options"
            (click)="openBottomSheet('SHARE')">
            <mat-icon>ios_share</mat-icon>
          </button>
        </div>
      </div>

      <p>room {{ roomName() }} works!</p>
      <p>{{ roomStore.currentRoom() | json }}</p>
      <p>{{ roomStore.currentPlayers() | json }}</p>
      <div class="flex gap-1 items-center place-content-center">
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

  openBottomSheet(sheetType: 'USER' | 'SHARE') {
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
