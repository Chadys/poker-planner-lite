import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: 'lobby', title: 'Lobby', component: LobbyComponent },
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
