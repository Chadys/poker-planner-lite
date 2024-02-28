import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RoomStore } from '@poker/data-models';

@Component({
  selector: 'app-lobby',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<p>Rooms: {{ store.availableRooms() }}</p> `,
  styles: ``,
  providers: [RoomStore],
})
export class LobbyComponent {
  readonly store = inject(RoomStore);
}
