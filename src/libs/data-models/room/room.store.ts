import { signalStore } from '@ngrx/signals';
import { withDevtools } from '@poker/utils';

export const RoomStore = signalStore(withDevtools('tasks'));

export type RoomStore = InstanceType<typeof RoomStore>;
