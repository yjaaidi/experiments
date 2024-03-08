import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import 'zone.js';
import { createResource, injectSuspenser, provideSuspenser } from './resource';
import { TodoRepository } from './todo.repository';
import { interval, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-todos',
  standalone: true,
  template: `
    @if (todosResource.hasValue) {
      <ul>
        @for (todo of todosResource(); track todo.id) {
          <li>
            <span>{{ todo.name }}</span>
          </li>
        }
      </ul>
    }
  `,
})
export class TodosComponent {
  todosResource = createResource(() => this.#repo.getTodos());
  #repo = inject(TodoRepository);
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-failing',
  template: `<h1>Failing component</h1>`,
})
export class FailingComponent {
  someResource = createResource(() =>
    interval(2000).pipe(
      switchMap(() => throwError(() => new Error('Failed!'))),
    ),
  );
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-suspense',
  providers: [provideSuspenser()],
  template: `
  <div [class.hidden]="!suspenser.success()"><ng-content/></div>

  @if(suspenser.pending()) {
    <p>Loading...</p>
  }

  @if(suspenser.errors().length > 0) {
    <p>Something went wrong.</p>
    <ul>
      @for(error of suspenser.errors(); track error) {
        <li>{{$any(error).message}}</li>
      }
    </ul>
  }
  `,
  styles: `
    .hidden {
      display: none;
    }
  `,
})
class SuspenseComponent {
  suspenser = injectSuspenser();
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-root',
  imports: [FailingComponent, TodosComponent, SuspenseComponent],
  template: `
    <fieldset>
      <legend>Todos & Failing components are <b>separated</b> here</legend>
      <app-suspense>
        <app-todos />
      </app-suspense>
      <hr>
      <app-suspense>
        <app-failing />
      </app-suspense>
    </fieldset>

    <fieldset>
      <legend>Todos & Failing components are <b>grouped</b> here</legend>
      <app-suspense>
        <app-todos />
        <app-failing />
      </app-suspense>
    </fieldset>
  `
})
export class AppComponent {
}
