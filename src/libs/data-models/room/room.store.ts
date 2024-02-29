import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@poker/utils';
import { RoomModel } from './room.model';
import { inject } from '@angular/core';
import { RoomService } from './room.service';
import { exhaustMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

export type RoomState = {
  currentRoom?: RoomModel;
  availableRooms: string[];
};

const initialState: RoomState = {
  currentRoom: undefined,
  availableRooms: [],
};

export const RoomStore = signalStore(
  withDevtools('rooms'),
  withState<RoomState>(initialState),
  withMethods((store, roomService = inject(RoomService)) => ({
    listAll: rxMethod<void>(
      exhaustMap(() => {
        return roomService.listAll().pipe(
          tapResponse({
            next: (availableRoom: string) =>
              patchState(store, state => ({
                availableRooms: [...state.availableRooms, availableRoom],
              })),
            error: console.error,
          })
        );
      })
    ),
  })),
  withHooks({
    onInit(store) {
      store.listAll();
    },
  })
);

export type RoomStore = InstanceType<typeof RoomStore>;
