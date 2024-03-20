import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<h1 class="text-center pt-20">404 page not found</h1>`,
  styles: ``,
})
export class PageNotFoundComponent {}
