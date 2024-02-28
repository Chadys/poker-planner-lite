import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@poker/utils';
import { UserModel } from './user.model';

type UserState = {
  user?: UserModel;
};

const initialState: UserState = {
  user: undefined,
};

export const UserStore = signalStore(
  withDevtools('users'),
  withState(initialState)
);

export type UserStore = InstanceType<typeof UserStore>;
