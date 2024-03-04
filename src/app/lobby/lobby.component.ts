import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RoomStore } from '@poker/data-models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RoomListDialogComponent } from './room-list-dialog/room-list-dialog.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-lobby',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, MatCardModule, MatButtonModule],
  template: `
    <div class="p-4">
      <div class="flex gap-1 items-center place-content-center">
        <img
          class="max-w-28"
          ngSrc="assets/logo.svg"
          alt="Poker Planner Lite logo"
          width="289.25"
          height="284.7"
          priority />
        <h1>Poker Planner Lite</h1>
      </div>
      <div class="flex justify-evenly pt-10">
        <button mat-flat-button color="primary" (click)="openDialog()">
          Join a room
        </button>
      </div>
    </div>
  `,
  styles: ``,
  providers: [RoomStore],
})
export class LobbyComponent {
  readonly store = inject(RoomStore);
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(RoomListDialogComponent, {
      data: this.store,
      maxHeight: '80vh',
    });
  }
}
