import { inject, Injectable } from '@angular/core';
import { distinct, map, Observable, retry, tap } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { VoteChoice } from './room.model';
import { UserModel, UserRoleEnum } from '../user';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  readonly mqttService = inject(MqttService);
  listAll(): Observable<string> {
    return this.mqttService
      .observe('rooms/+/connected-players/+', { qos: 0 })
      .pipe(
        tap((message: IMqttMessage) => console.debug(message)),
        map((message: IMqttMessage) => {
          const result = /^rooms\/([-\w]+)\//.exec(message.topic);
          return result ? result[1] : '';
        }),
        distinct()
      );
  }
  addPlayerToRoom(
    roomName: string,
    playerName: string,
    onComplete: (() => void) | undefined = undefined
  ): void {
    this.mqttService
      .publish(`rooms/${roomName}/connected-players/${playerName}`, '1', {
        qos: 1,
        retain: true,
        properties: {
          payloadFormatIndicator: true,
          messageExpiryInterval: 21600, // 6 hours
        },
      })
      .pipe(retry({ count: 3, delay: 1000, resetOnSuccess: true }))
      .subscribe({ complete: onComplete, error: console.error });
  }

  getPlayers(
    roomName: string
  ): Observable<{ player: string; isDeleted: boolean }> {
    return this.mqttService
      .observe(`rooms/${roomName}/connected-players/+`, { qos: 0 })
      .pipe(
        tap((message: IMqttMessage) => console.debug(message)),
        map((message: IMqttMessage) => {
          const result = /([-\w]+)$/.exec(message.topic);
          const playerName = result ? result[1] : '';
          return {
            player: playerName,
            isDeleted: message.payload.toString() !== '1',
          };
        })
      );
  }

  getCurrentRound(roomName: string) {
    return this.mqttService
      .observe(`rooms/${roomName}/current-round/`, { qos: 0 })
      .pipe(
        tap((message: IMqttMessage) => console.debug(message)),
        map((message: IMqttMessage) => Number(message.payload.toString()))
      );
  }

  getVotes(roomName: string): Observable<{
    roundNumber: number;
    player: string;
    voteOption: VoteChoice;
  }> {
    return this.mqttService
      .observe(`rooms/${roomName}/votes/#`, { qos: 0 })
      .pipe(
        tap((message: IMqttMessage) => console.debug(message)),
        map((message: IMqttMessage) => {
          const result = /(\d+)\/([-\w]+)$/.exec(message.topic);
          console.debug(result);
          const roundNumber = result ? Number(result[1]) : 0;
          const player = result ? result[2] : '';
          return {
            roundNumber: roundNumber,
            player: player,
            voteOption: message.payload.toString() as VoteChoice,
          };
        })
      );
  }

  vote(
    roomName: string,
    currentRound: number,
    user: UserModel | null,
    voteOption: VoteChoice
  ): void {
    if (!user || user.role == UserRoleEnum.Observer) {
      return;
    }
    this.mqttService
      .publish(
        `rooms/${roomName}/votes/${currentRound}/${user.name}`,
        voteOption,
        {
          qos: 1,
          retain: true,
          properties: {
            payloadFormatIndicator: true,
            messageExpiryInterval: 300, // 5min
          },
        }
      )
      .pipe(retry({ count: 3, delay: 1000, resetOnSuccess: true }))
      .subscribe({ error: console.error });
  }
}
