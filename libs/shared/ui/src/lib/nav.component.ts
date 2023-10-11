import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { rxComputed } from '@jscutlery/rx-computed';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';

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
    AsyncPipe,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    NgIf,
    NgForOf,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="isHandset() ? 'dialog' : 'navigation'"
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
      >
        <mat-nav-list>
          <a
            *ngFor="let link of links"
            #routerLinkActive="routerLinkActive"
            [activated]="routerLinkActive.isActive"
            [routerLink]="link.route"
            [queryParams]="link.queryParams"
            (click)="drawer.mode === 'over' && drawer.toggle()"
            mat-list-item
            routerLinkActive
            >{{ link.name }}</a
          >
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset()"
          >
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>{{ title }}</span>
        </mat-toolbar>
        <ng-content />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100%;
      }

      .sidenav {
        width: 200px;
      }
    `,
  ],
})
export class NavComponent {
  @Input({ required: true }) links!: Link[];
  @Input({ required: true }) title!: string;

  isHandset = rxComputed(() =>
    this._breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches))
  );

  private _breakpointObserver = inject(BreakpointObserver);
}
