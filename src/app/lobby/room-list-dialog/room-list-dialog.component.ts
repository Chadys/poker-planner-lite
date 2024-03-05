import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RoomStore } from '@poker/data-models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { forbiddenValuesValidator } from '@poker/utils';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { MatListItem, MatNavList } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatButton,
    JsonPipe,
    MatListItem,
    MatNavList,
    MatError,
    MatFormField,
  ],
  template: `
    <div class="min-w-96 w-full p-3">
      <h2>Create a room</h2>
      <form
        [formGroup]="newRoomForm()"
        class="flex flex-row gap-4"
        (ngSubmit)="createRoom()">
        <mat-form-field>
          <input
            type="text"
            formControlName="name"
            matInput
            placeholder="Enter the name of the room"
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
            @if (name.errors?.['forbiddenValue']) {
              <mat-error>
                Name cannot be an existing room.
                <a class="underline" href="/room/{{ name.value }}">Join it</a>
                instead?
              </mat-error>
            }
          }
        </mat-form-field>
        <button
          mat-flat-button
          color="accent"
          type="submit"
          [disabled]="!newRoomForm().valid">
          Create
        </button>
      </form>

      <p>or</p>
      <h2>Join an active room</h2>
      <mat-nav-list>
        @for (roomName of dialogData.availableRooms(); track roomName) {
          <a mat-list-item href="/room/{{ roomName }}">{{ roomName }}</a>
        }
      </mat-nav-list>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomListDialogComponent {
  readonly dialogData: RoomStore = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<RoomListDialogComponent>);
  readonly router = inject(Router);

  newRoomForm = computed(() => {
    return new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-\w]+$/),
        forbiddenValuesValidator(this.dialogData.availableRooms()),
      ]),
    });
  });

  get name() {
    return this.newRoomForm().get('name');
  }

  async createRoom() {
    if (this.name?.value) {
      await this.router.navigate(['room', this.name.value]);
      this.dialogRef.close();
    }
  }
}
