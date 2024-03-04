import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserCreationDialogComponent } from './user-creation-dialog/user-creation-dialog.component';

@Component({
  selector: 'app-room',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<p>room {{ roomName() }} works!</p>`,
  styles: ``,
})
export class RoomComponent {
  roomName = input.required<string>();
  readonly dialog = inject(MatDialog);

  constructor() {
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(UserCreationDialogComponent, {
      disableClose: true,
      data: this.roomName,
      maxHeight: '80vh',
    });
  }
}
