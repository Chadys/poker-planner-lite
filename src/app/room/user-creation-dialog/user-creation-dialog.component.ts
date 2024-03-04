import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { RoomService, UserRoleEnum } from '@poker/data-models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-user-creation-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatListItem,
    MatNavList,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
  ],
  template: `
    <div class="min-w-96 p-3">
      <h2>Welcome</h2>
      <form
        [formGroup]="newUserForm()"
        class="flex flex-col gap-2"
        (ngSubmit)="joinRoom()">
        <mat-form-field>
          <input
            type="text"
            formControlName="name"
            matInput
            placeholder="Enter your name"
            required />

          @if (name && name.invalid && (name.dirty || name.touched)) {
            @if (name.errors?.['required']) {
              <mat-error> You must enter a value. </mat-error>
            }
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Your role</mat-label>
          <mat-select formControlName="role">
            @for (role of roles; track role) {
              <mat-option [value]="role">{{ UserRoleEnum[role] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <button
          mat-flat-button
          color="accent"
          type="submit"
          [disabled]="!newUserForm().valid">
          Join
        </button>
      </form>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreationDialogComponent {
  readonly dialogData: Signal<string> = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<UserCreationDialogComponent>);
  readonly roomService = inject(RoomService);
  readonly roles = [UserRoleEnum.Player, UserRoleEnum.Observer];

  newUserForm = computed(() => {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      role: new FormControl(UserRoleEnum.Player, [Validators.required]),
    });
  });

  get name() {
    return this.newUserForm().get('name');
  }

  get role() {
    return this.newUserForm().get('role');
  }

  joinRoom(): void {
    this.roomService.createRoom(this.dialogData(), () =>
      this.dialogRef.close()
    );
  }

  protected readonly UserRoleEnum = UserRoleEnum;
}
