import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  RoomStore,
  UserRoleEnum,
  UserRoleEnumChoices,
  UserStore,
} from '@poker/data-models';
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
    <div class="min-w-96 w-full p-3">
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
            @if (name.errors?.['pattern']) {
              <mat-error>
                You must only use unaccented letter, number, underscore or dash
                characters.
              </mat-error>
            }
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Your role</mat-label>
          <mat-select formControlName="role" required>
            @for (role of UserRoleEnumChoices; track role) {
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
  readonly dialogData: { roomStore: RoomStore; userStore: UserStore } =
    inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<UserCreationDialogComponent>);

  newUserForm = computed(() => {
    return new FormGroup({
      name: new FormControl(this.dialogData.userStore.user()?.name || '', [
        Validators.required,
        Validators.pattern(/^[-\w]+$/),
      ]),
      role: new FormControl(
        this.dialogData.userStore.user()?.role || UserRoleEnum.Player,
        [Validators.required]
      ),
    });
  });

  get name() {
    return this.newUserForm().get('name');
  }

  get role() {
    return this.newUserForm().get('role');
  }

  joinRoom(): void {
    if (this.name?.value && this.role?.value != null) {
      this.dialogData.userStore.setUser({
        name: this.name.value,
        role: this.role.value,
      });
      if ((this.role.value as UserRoleEnum) == UserRoleEnum.Player) {
        this.dialogData.roomStore.addPlayerToRoom(
          this.dialogData.roomStore.currentRoom().name,
          this.name.value,
          () => this.dialogRef.close()
        );
      } else {
        this.dialogRef.close();
      }
    }
  }

  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly UserRoleEnumChoices = UserRoleEnumChoices;
}
