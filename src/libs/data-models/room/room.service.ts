import { inject, Injectable } from '@angular/core';
import { Observable, map, tap, retry } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  readonly mqttService = inject(MqttService);
  listAll(): Observable<string> {
    return this.mqttService.observe('test', { qos: 0 }).pipe(
      tap((message: IMqttMessage) => console.debug(message)),
      map((message: IMqttMessage) => message.payload.toString())
    );
  }
  createRoom(
    roomName: string,
    onComplete: (() => void) | undefined = undefined
  ): void {
    this.mqttService
      .publish('test', roomName, {
        qos: 1,
        retain: true,
        properties: {
          payloadFormatIndicator: true,
          messageExpiryInterval: 21600,
        },
      })
      .pipe(retry({ count: 3, delay: 1000, resetOnSuccess: true }))
      .subscribe({ complete: onComplete, error: console.error });
  }
}
