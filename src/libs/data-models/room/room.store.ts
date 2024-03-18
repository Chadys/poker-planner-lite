import {
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
import { timer, exhaustMap, merge, scan, switchMap, take, tap } from 'rxjs';
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
    const launchCountdown = rxMethod<number>(
      switchMap(countdownSeconds => {
        console.debug('launchCountdown', countdownSeconds);
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
        roomName: string,
        playerName: string,
        onComplete: (() => void) | undefined = undefined
      ): void {
        console.debug('addPlayerToRoom', roomName, playerName);
        roomService.addPlayerToRoom(roomName, playerName, onComplete);
      },

      vote(
        currentRoom: RoomModel,
        user: UserModel | null,
        voteOption: VoteChoice
      ): void {
        console.debug('vote', currentRoom, user, voteOption);
        roomService.vote(
          currentRoom.name,
          currentRoom.currentRound,
          user,
          voteOption
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
    };
  })
);

export type RoomStore = InstanceType<typeof RoomStore>;
