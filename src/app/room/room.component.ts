import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserCreationDialogComponent } from './user-creation-dialog/user-creation-dialog.component';
import {
  RoomStore,
  UserStore,
  VoteChoice,
  voteChoices,
} from '@poker/data-models';
import { JsonPipe } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-room',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, MatButton, MatAnchor, MatListItem],
  template: `
    <div class="p-4">
      <a mat-stroked-button href="/lobby"> Back to lobby </a>
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

  protected readonly voteChoices = voteChoices;

  vote(voteOption: VoteChoice) {
    this.roomStore.vote(
      this.roomStore.currentRoom(),
      this.userStore.user(),
      voteOption
    );
  }
}
