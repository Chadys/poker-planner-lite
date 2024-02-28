import { ApplicationConfig, Injectable } from '@angular/core';
import {
  provideRouter,
  RouterStateSnapshot,
  TitleStrategy,
  withComponentInputBinding,
} from '@angular/router';

import { routes } from './app.routes';
import { Title } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Poker Planner Lite | ${title}`);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    provideAnimationsAsync(),
  ],
};
