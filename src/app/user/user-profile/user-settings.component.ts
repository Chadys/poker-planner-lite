import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { RoomStore, UserRoleEnum, UserStore } from '@poker/data-models';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
} from '@angular/material/list';
import { MatDialogClose } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="text-center flex flex-col justify-between h-full">
      <h2>
        You are user <strong>{{ sheetData.userStore.user()?.name }}</strong>
      </h2>
      <h2>
        You have the role
        <strong>
          <mat-icon class="align-middle">{{ roleIcon }}</mat-icon>
          {{ sheetData.userStore.userDisplayRole() }}</strong
        >
      </h2>
      <mat-divider></mat-divider>
      <div>
        <h3 class="mt-4">Other players debug</h3>
        <mat-action-list>
          @for (
            playerName of sheetData.roomStore.currentPlayers();
            track playerName
          ) {
            @if (playerName !== sheetData.userStore.user()?.name) {
              <button
                mat-list-item
                (click)="deletePlayer(playerName)"
                [attr.aria-label]="'Button to delete player ' + playerName">
                <mat-icon matListItemIcon>delete</mat-icon>
                <div matListItemTitle>{{ playerName }}</div>
              </button>
            }
          }
        </mat-action-list>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    MatActionList,
    MatListItem,
    MatDialogClose,
    MatListItemIcon,
    MatListItemTitle,
    RouterLink,
    MatDivider,
  ],
})
export class UserSettingsComponent {
  readonly sheetData: { roomStore: RoomStore; userStore: UserStore } = inject(
    MAT_BOTTOM_SHEET_DATA
  );
  readonly roleIcon =
    this.sheetData.userStore.user()?.role == UserRoleEnum.Observer
      ? 'visibility'
      : 'videogame_asset';
  protected readonly UserRoleEnum = UserRoleEnum;

  deletePlayer(playerName: string) {
    this.sheetData.roomStore.removePlayerFromRoom(playerName);
  }
}
