import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lobby',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<p>lobby works!</p>`,
  styles: ``,
})
export class LobbyComponent {}
