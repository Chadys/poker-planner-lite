import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';

const resolvedRoomTitle: ResolveFn<string> = (route: ActivatedRouteSnapshot) =>
  `Room ${route.paramMap.get('roomName')}`;

export const routes: Routes = [
  {
    path: 'lobby',
    title: 'Lobby',
    loadComponent: () =>
      import('./lobby/lobby.component').then(x => x.LobbyComponent),
  },
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  {
    path: 'room/:roomName',
    title: resolvedRoomTitle,
    loadComponent: () =>
      import('./room/room.component').then(x => x.RoomComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        x => x.PageNotFoundComponent
      ),
  },
];
