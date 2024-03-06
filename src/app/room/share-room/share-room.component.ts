import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-share-room',
  standalone: true,
  imports: [
    MatTooltip,
    MatIcon,
    CdkCopyToClipboard,
    MatLabel,
    MatFormField,
    MatIconButton,
    MatPrefix,
    MatSuffix,
    MatInput,
    QRCodeModule,
  ],
  template: `
    <div>
      <h1>Give access to room {{ sheetData() }} to your coworkers</h1>
      <p>Share the link</p>
      <mat-form-field class="w-full">
        <span matTextPrefix>URL &nbsp;</span>
        <input
          matInput
          type="text"
          value="{{ document.location.href }}"
          readonly
          disabled />
        <button
          matSuffix
          mat-icon-button
          aria-label="Copy link"
          matTooltip="Copy link"
          color="primary"
          (click)="changeCopyIcon()"
          [cdkCopyToClipboard]="document.location.href">
          <mat-icon>{{ copyIcon() }}</mat-icon>
        </button>
      </mat-form-field>
      <p>or Share the QRCode</p>
      <qrcode
        class="flex justify-center"
        [width]="300"
        [qrdata]="document.location.href"
        [errorCorrectionLevel]="'L'"></qrcode>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareRoomComponent {
  readonly sheetData: Signal<string> = inject(MAT_BOTTOM_SHEET_DATA);
  readonly copyIcon: WritableSignal<string> = signal('content_copy');
  readonly document = inject(DOCUMENT);

  changeCopyIcon() {
    this.copyIcon.set('done');
    setTimeout(() => {
      this.copyIcon.set('content_copy');
    }, 1000);
  }

  protected readonly location = location;
}
