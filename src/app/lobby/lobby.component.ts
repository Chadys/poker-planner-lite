import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RoomStore } from '@poker/data-models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomJoinComponent } from './room-join/room-join.component';

@Component({
  selector: 'app-lobby',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="p-4">
      <div class="flex gap-1 items-center place-content-center">
        <img
          class="max-w-28"
          src="assets/logo.svg"
          alt="Poker Planner Lite logo" />
        <h1>Poker Planner Lite</h1>
      </div>
      <div class="flex justify-evenly pt-10">
        <button mat-flat-button color="primary" (click)="openDialog('create')">
          Create a room
        </button>
        <button mat-flat-button color="accent" (click)="openDialog('join')">
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

  openDialog(dialogType: 'create' | 'join'): void {
    const DialogComponent =
      dialogType == 'create' ? RoomCreateComponent : RoomJoinComponent;
    this.dialog.open(DialogComponent, {
      data: this.store,
      maxHeight: '80vh',
    });
  }
}
