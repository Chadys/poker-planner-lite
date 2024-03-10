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
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { forbiddenValuesValidator } from '@poker/utils';
import { JsonPipe } from '@angular/common';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

@Component({
  selector: 'app-user-creation-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    JsonPipe,
    MatRadioButton,
    MatRadioGroup,
  ],
  template: `
    <div class="w-full p-3">
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

        <mat-radio-group formControlName="role" required>
          <mat-label>Your role</mat-label>
          @for (role of UserRoleEnumChoices; track role) {
            <mat-radio-button [value]="role">{{
              UserRoleEnum[role]
            }}</mat-radio-button>
          }
        </mat-radio-group>
        @if (newUserForm().errors?.['forbiddenValue']) {
          <mat-error>
            There is already a Player with that name, change your role if that's
            you, else change your name
          </mat-error>
        }

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
    return new FormGroup(
      {
        name: new FormControl(this.dialogData.userStore.user()?.name || '', [
          Validators.required,
          Validators.pattern(/^[-\w]+$/),
        ]),
        role: new FormControl(
          this.dialogData.userStore.user()?.role || UserRoleEnum.Player,
          [Validators.required]
        ),
      },
      {
        validators: [
          this.observerWithPlayerName(
            this.dialogData.roomStore.currentPlayers()
          ),
        ],
      }
    );
  });

  get name() {
    return this.newUserForm().get('name');
  }

  get role() {
    return this.newUserForm().get('role');
  }

  observerWithPlayerName(forbiddenValues: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.get('name');
      const role = control.get('role');

      return (
        (role &&
          name &&
          role.value === UserRoleEnum.Observer &&
          forbiddenValuesValidator(forbiddenValues)(name)) ||
        null
      );
    };
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
