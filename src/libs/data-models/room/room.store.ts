import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@poker/utils';
import { roomDefault, RoomModel, VoteChoice } from './room.model';
import { computed, inject } from '@angular/core';
import { RoomService } from './room.service';
import {
  timer,
  exhaustMap,
  merge,
  scan,
  switchMap,
  take,
  tap,
  EMPTY,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { UserModel } from '../user';
import { environment } from '../../../environments/environment';

export type RoomState = {
  currentRoom: RoomModel;
  availableRooms: string[];
  countdown: number | null; // in seconds
};

const initialState: RoomState = {
  currentRoom: roomDefault,
  availableRooms: [],
  countdown: null,
};

export const RoomStore = signalStore(
  withDevtools('rooms'),
  withState<RoomState>(initialState),
  withComputed(({ currentRoom }) => ({
    currentVotes: computed(
      () => currentRoom.votePerRoundPerPlayer()[currentRoom.currentRound()]
    ),
    historyVotes: computed(() => {
      return Object.fromEntries(
        Object.entries(currentRoom.votePerRoundPerPlayer()).filter(
          ([round]) => Number(round) != currentRoom.currentRound()
        )
      );
    }),
    currentPlayers: computed(() =>
      Object.keys(
        currentRoom.votePerRoundPerPlayer()[currentRoom.currentRound()]
      )
    ),
  })),
  withMethods((store, roomService = inject(RoomService)) => {
    const launchCountdown = rxMethod<number | null>(
      switchMap(countdownSeconds => {
        console.debug('launchCountdown', countdownSeconds);
        if (countdownSeconds === null) {
          return EMPTY;
        }
        return timer(0, 1000).pipe(
          scan(acc => --acc, countdownSeconds + 1),
          take(countdownSeconds + 1),
          tap(countdown => {
            console.debug('countdown', countdown);
            patchState(store, () => ({
              countdown,
            }));
          })
        );
      })
    );
    const stopCountdown = rxMethod<void>(
      switchMap(() => {
        // workaround to make countdown stop instead of using launchCountdown.unsubscribe
        // because it seems to prevent countdown from being started ever again afterward
        launchCountdown(null);
        // no idea why this is necessary instead of synchronously calling patchState...
        return timer(0, 1000).pipe(
          take(1),
          tap(() =>
            patchState(store, () => ({
              countdown: null,
            }))
          )
        );
      })
    );

    function getCurrentRound(name: string) {
      console.debug('getCurrentRound', name);
      return roomService.getCurrentRound(name).pipe(
        tapResponse({
          next: (currentRound: number) => {
            console.debug('service getCurrentRound', name, currentRound);
            patchState(store, state => {
              if (state.currentRoom.currentRound !== currentRound) {
                const currentPlayers = Object.keys(
                  state.currentRoom.votePerRoundPerPlayer[
                    state.currentRoom.currentRound
                  ]
                );
                // update round, clone player
                return {
                  countdown: null,
                  currentRoom: {
                    ...state.currentRoom,
                    currentRound,
                    votePerRoundPerPlayer: {
                      ...state.currentRoom.votePerRoundPerPlayer,
                      [currentRound]: Object.fromEntries(
                        currentPlayers.map(player => [player, null])
                      ),
                    },
                  } as RoomModel,
                };
              } else {
                return {};
              }
            });
          },
          error: console.error,
        })
      );
    }

    function getPlayers(name: string) {
      console.debug('getPlayers', name);
      return roomService.getPlayers(name).pipe(
        tapResponse({
          next: ({ player, isDeleted }) => {
            console.debug('service getPlayers', name, player, isDeleted);
            patchState(store, state => {
              if (isDeleted) {
                const { [player]: removedKey, ...roundVoteWithoutPlayer } =
                  state.currentRoom.votePerRoundPerPlayer[
                    state.currentRoom.currentRound
                  ];
                if (
                  Object.values(roundVoteWithoutPlayer).every(
                    voteOption => voteOption !== null
                  )
                ) {
                  // without that player, all votes have been received
                  launchCountdown(environment.defaultCountdown);
                }
                return {
                  currentRoom: {
                    ...state.currentRoom,
                    votePerRoundPerPlayer: {
                      ...state.currentRoom.votePerRoundPerPlayer,
                      [state.currentRoom.currentRound]: roundVoteWithoutPlayer,
                    },
                  } as RoomModel,
                };
              }
              stopCountdown();
              return {
                currentRoom: {
                  ...state.currentRoom,
                  votePerRoundPerPlayer: {
                    ...state.currentRoom.votePerRoundPerPlayer,
                    [state.currentRoom.currentRound]: {
                      ...state.currentRoom.votePerRoundPerPlayer[
                        state.currentRoom.currentRound
                      ],
                      [player]: null,
                    },
                  },
                },
              };
            });
          },
          error: console.error,
        })
      );
    }

    function getVotes(name: string) {
      console.debug('getVotes', name);
      return roomService.getVotes(name).pipe(
        tapResponse({
          next: ({ roundNumber, player, voteOption }) => {
            console.debug(
              'service getVotes',
              name,
              roundNumber,
              player,
              voteOption
            );
            patchState(store, state => {
              const newResult = {
                ...state.currentRoom.votePerRoundPerPlayer[roundNumber],
                [player]: voteOption,
              };
              if (
                Object.values(newResult).every(
                  voteOption => voteOption !== null
                )
              ) {
                // all votes have been received
                launchCountdown(environment.defaultCountdown);
              }
              return {
                currentRoom: {
                  ...state.currentRoom,
                  votePerRoundPerPlayer: {
                    ...state.currentRoom.votePerRoundPerPlayer,
                    [roundNumber]: newResult,
                  },
                } as RoomModel,
              };
            });
          },
          error: console.error,
        })
      );
    }

    return {
      listAll: rxMethod<void>(
        exhaustMap(() => {
          console.debug('listAll');
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

      addPlayerToRoom(
        playerName: string,
        onComplete: (() => void) | undefined = undefined
      ): void {
        const state = getState(store);
        console.debug('addPlayerToRoom', state.currentRoom.name, playerName);
        roomService.addPlayerToRoom(
          state.currentRoom.name,
          playerName,
          onComplete
        );
      },

      removePlayerFromRoom(playerName: string): void {
        const state = getState(store);
        console.debug(
          'removePlayerFromRoom',
          state.currentRoom.name,
          playerName
        );
        roomService.removePlayerFromRoom(state.currentRoom.name, playerName);
      },

      vote(user: UserModel | null, voteOption: VoteChoice): void {
        const state = getState(store);
        console.debug('vote', state.currentRoom, user, voteOption);
        roomService.vote(
          state.currentRoom.name,
          state.currentRoom.currentRound,
          user,
          voteOption
        );
      },

      incrementRound(): void {
        const state = getState(store);
        console.debug('incrementRound', state.currentRoom.currentRound);
        roomService.setRound(
          state.currentRoom.name,
          state.currentRoom.currentRound + 1
        );
      },

      getOne: rxMethod<string>(
        exhaustMap((name: string) => {
          console.debug('getOne', name);
          patchState(store, state => ({
            currentRoom: {
              ...state.currentRoom,
              name,
            } as RoomModel,
          }));
          return merge(getPlayers(name), getCurrentRound(name), getVotes(name));
        })
      ),

      launchCountdown,
      stopCountdown,
    };
  })
);

export type RoomStore = InstanceType<typeof RoomStore>;
