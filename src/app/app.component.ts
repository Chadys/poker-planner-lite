import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <main>
      <router-outlet />
    </main>
  `,
  styles: ``,
})
export class AppComponent {
  title = 'poker-planner-lite';
}
