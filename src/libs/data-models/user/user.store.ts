import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@poker/utils';
import { UserModel, UserRoleEnum } from './user.model';
import { computed } from '@angular/core';

type UserState = {
  user: UserModel | null;
};

const initialState: UserState = {
  user: null,
};

export const UserStore = signalStore(
  withDevtools('users'),
  withState<UserState>(initialState),
  withComputed(({ user }) => ({
    userDisplayRole: computed(() => {
      const currentUser = user();
      if (currentUser != null) {
        return UserRoleEnum[currentUser.role];
      }
      return null;
    }),
  })),
  withMethods(store => ({
    syncCachedUser(): void {
      const savedUser: string | null = localStorage.getItem('user');
      if (savedUser) {
        const user: UserModel = JSON.parse(savedUser);
        patchState(store, () => ({ user }));
      }
    },
    setUser(user: UserModel): void {
      patchState(store, () => ({ user }));
      localStorage.setItem('user', JSON.stringify(user));
    },
  })),
  withHooks({
    onInit(store) {
      store.syncCachedUser();
    },
  })
);

export type UserStore = InstanceType<typeof UserStore>;
