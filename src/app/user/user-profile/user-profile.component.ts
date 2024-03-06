import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UserRoleEnum, UserStore } from '@poker/data-models';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="text-center flex flex-col place-content-center h-full">
      <h2>
        You are user <strong>{{ sheetData.user()?.name }}</strong>
      </h2>
      <h2>
        You have the role
        <strong>
          <mat-icon class="align-middle">{{ roleIcon }}</mat-icon>
          {{ sheetData.userDisplayRole() }}</strong
        >
      </h2>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class UserProfileComponent {
  readonly sheetData: UserStore = inject(MAT_BOTTOM_SHEET_DATA);
  readonly roleIcon =
    this.sheetData.user()?.role == UserRoleEnum.Observer
      ? 'visibility'
      : 'videogame_asset';
  protected readonly UserRoleEnum = UserRoleEnum;
}
