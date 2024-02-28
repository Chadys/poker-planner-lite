import { signalStore } from '@ngrx/signals';
import { withDevtools } from '@poker/utils';

export const UserStore = signalStore(withDevtools('tasks'));

export type UserStore = InstanceType<typeof UserStore>;
