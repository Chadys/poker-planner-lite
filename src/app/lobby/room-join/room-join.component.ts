import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomState } from '@poker/data-models';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-room-join',
  standalone: true,
  imports: [MatListModule],
  template: `
    <div class="w-96 p-3">
      <h2>Join an active room</h2>
      <mat-nav-list>
        @for (roomName of dialogData.availableRooms; track roomName) {
          <a mat-list-item href="/room/{{ roomName }}">{{ roomName }}</a>
        }
      </mat-nav-list>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomJoinComponent {
  readonly dialogData: RoomState = inject(MAT_DIALOG_DATA);
}
