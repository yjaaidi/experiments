import { Component } from "@angular/core";
import { type ComponentFixture } from "@angular/core/testing";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-root",
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="(isHandset$ | async) === false"
      >
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a
            mat-list-item
            [routerLink]="['dashboard']"
            routerLinkActive="active"
            >Dashboard</a
          >
          <a mat-list-item [routerLink]="['customer']" routerLinkActive="active"
            >Customer</a
          >
          <a mat-list-item [routerLink]="['admin']" routerLinkActive="active"
            >Admin</a
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
            *ngIf="isHandset$ | async"
          >
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>ng-vite</span>
        </mat-toolbar>
        <main><router-outlet></router-outlet></main>
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

      .sidenav .mat-toolbar {
        background: inherit;
      }

      .mat-toolbar.mat-primary {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .active {
        font-weight: 600;
      }
    `,
  ],
})
export class AppComponent {
  title = "ng-vite";

  isHandset$: Observable<boolean> = of(false);
}

if (import.meta.vitest) {
	const { it, expect, describe, beforeEach } = import.meta.vitest;
	const { TestBed } = await import('@angular/core/testing');
	const { RouterTestingModule } = await import('@angular/router/testing');
  const { NoopAnimationsModule } = await import("@angular/platform-browser/animations");


  describe("AppComponent", () => {
    let fixture: ComponentFixture<AppComponent>;
    let main: HTMLElement;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule],
        declarations: [AppComponent],
      }).compileComponents();
    });
  
    it('should display content', () => {
      fixture = TestBed.createComponent(AppComponent);
      main = fixture.nativeElement.querySelector("main");
      
      expect(main.textContent).toContain("Hello Dashboard");
    });
  });
}