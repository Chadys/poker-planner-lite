import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  listAll(): Observable<string[]> {
    return of(['toto', 'tata']);
  }
}
