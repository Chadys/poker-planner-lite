import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [],
  template: ` <p>room-create works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCreateComponent {}
