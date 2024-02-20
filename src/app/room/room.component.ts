import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-room',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<p>room {{ roomName() }} works!</p>`,
  styles: ``,
})
export class RoomComponent {
  roomName = input.required<string>(); // InputSignal<string>
}
