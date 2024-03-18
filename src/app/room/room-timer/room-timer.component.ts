import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Signal,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-room-timer',
  standalone: true,
  imports: [MatProgressSpinner, JsonPipe],
  template: `
    <div class="relative w-min">
      <mat-progress-spinner
        [color]="timerColor()"
        mode="determinate"
        [value]="timerValue()">
        test
      </mat-progress-spinner>
      @if (countdown()) {
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
          {{ countdown() }}
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomTimerComponent {
  countdown = input.required<number | null>(); // InputSignal<string>

  timerValue: Signal<number> = computed(
    () => ((this.countdown() || 0) / environment.defaultCountdown) * 100
  );
  timerColor: Signal<string> = computed(() =>
    this.timerValue() < 40 ? 'warn' : 'accent'
  );
}
