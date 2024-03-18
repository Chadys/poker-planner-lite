import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import {
  RoomStore,
  UserRoleEnum,
  UserStore,
  VoteChoice,
  voteChoices,
} from '@poker/data-models';
import { MatIcon } from '@angular/material/icon';
import { PokerCardComponent } from '../../room/poker-card/poker-card.component';

@Component({
  selector: 'app-user-deck',
  standalone: true,
  imports: [MatIcon, PokerCardComponent],
  template: `
    <h3 class="text-center font-bold !mb-0">{{ userStore.user()?.name }}</h3>
    @if (userStore.user()?.role === UserRoleEnum.Observer) {
      <div>
        <h4 class="text-center font-bold">
          You are in
          <mat-icon class="align-middle">visibility</mat-icon> observer mode
        </h4>
        <p class="text-center caption font-thin">
          Reload page to change your role
        </p>
      </div>
    } @else if (userStore.user()?.role === UserRoleEnum.Player) {
      <div class="flex gap-1 place-content-center">
        @for (voteOption of voteChoices; track voteOption) {
          <app-poker-card
            [content]="voteOption"
            size="L"
            [class]="
              voteOption === userVote()
                ? ['pb-2', 'pt-0']
                : roomStore.countdown() === 0
                  ? ['pt-2']
                  : ['hover:pb-2', 'hover:pt-0', 'pt-2']
            "
            [disabled]="roomStore.countdown() === 0"
            [active]="voteOption === userVote()"
            (click)="vote(voteOption)"></app-poker-card>
        }
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeckComponent {
  readonly roomStore = inject(RoomStore);
  readonly userStore = inject(UserStore);
  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly voteChoices = voteChoices;

  readonly userVote: Signal<VoteChoice | null> = computed(() => {
    const user = this.userStore.user();
    if (user !== null) {
      return this.roomStore.currentVotes()[user.name];
    }
    return null;
  });

  vote(voteOption: VoteChoice) {
    this.roomStore.vote(this.userStore.user(), voteOption);
  }
}
