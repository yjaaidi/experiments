import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs/operators';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Link {
  name: string;
  route: string[];
  queryParams?: Record<string, string>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-nav',
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav
        #drawer
        fixedInViewport
        [attr.role]="isHandset() ? 'dialog' : 'navigation'"
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
      >
        <mat-nav-list [style.width.px]="200">
          @for (link of links(); track link) {
            <a
              #routerLinkActive="routerLinkActive"
              [activated]="routerLinkActive.isActive"
              [routerLink]="link.route"
              [queryParams]="link.queryParams"
              (click)="drawer.mode === 'over' && drawer.toggle()"
              mat-list-item
              routerLinkActive
              >{{ link.name }}</a
            >
          }
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="content">
        <mat-toolbar color="primary">
          @if (isHandset()) {
            <button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()"
            >
              <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
            </button>
          }
          <span>{{ title() }}</span>
        </mat-toolbar>
        <ng-content />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .content {
      min-height: 100vh;
    }
  `,
})
export class NavComponent {
  readonly links = input.required<Link[]>();
  readonly title = input.required<string>();

  private _breakpointObserver = inject(BreakpointObserver);

  isHandset = toSignal(
    this._breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches)),
  );
}
