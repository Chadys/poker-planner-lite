import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-poker-card',
  standalone: true,
  imports: [],
  template: `
    <button
      class="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
      {{ content() }}
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokerCardComponent {
  content = input.required<string | null>();
}
