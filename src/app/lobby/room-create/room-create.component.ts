import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RoomService, RoomStore } from '@poker/data-models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { forbiddenValuesValidator } from '@poker/utils';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    JsonPipe,
  ],
  template: `
    <div class="w-96 p-3">
      <h2>Create a room</h2>

      <form
        [formGroup]="newRoomForm()"
        (ngSubmit)="createRoom()"
        class="flex flex-col gap-2">
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
          color="primary"
          type="submit"
          class="self-end"
          [disabled]="!newRoomForm().valid">
          Create
        </button>
      </form>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCreateComponent {
  readonly dialogData: RoomStore = inject(MAT_DIALOG_DATA);
  readonly roomService = inject(RoomService);

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

  createRoom() {
    if (this.name?.value) {
      this.roomService.createRoom(this.name.value);
    }
  }
}
