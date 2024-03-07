import {
  Component,
  Injectable,
  Signal,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  SuspenseLax,
  pending,
  suspensify
} from '@jscutlery/operators';
import { rxComputed } from '@jscutlery/rx-computed';
import { BehaviorSubject, Observable, Subject, delay, exhaustMap, merge, of } from 'rxjs';
import 'zone.js';

@Injectable({
  providedIn: 'root',
})
class TodoRepo {
  #todos: Todo[] = [
    {
      id: generateId(),
      name: 'Burger',
    },
    {
      id: generateId(),
      name: 'Salad',
    },
  ];

  async addTodo({name}: { name: string }): Promise<Todo> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (name.toLocaleLowerCase().includes('error')) {
      throw new Error('Failed to add todo.');
    }

    return {
      id: generateId(),
      name: name.charAt(0).toLocaleUpperCase() + name.slice(1),
    }
  }

  getTodos() {
    return of(this.#todos).pipe(delay(1000));
  }
}

interface Todo {
  id: string;
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (input)="addTodo.cancel()" (ngSubmit)="add()">
      <input
        [disabled]="addTodo.pending()"
        [(ngModel)]="name"
        name="name"/>
    </form>

    @if(addTodo.error()) {
      <button type="button" (click)="addTodo.retry()">RETRY</button>
    }

    @if(todosResource().pending) {
      <p>Loading...</p>
    }
    
    <ul>
      @for(todo of todos(); track todo.id) {
        <li [class.pending]="todo.pending">{{todo.name}}</li>
      }
    </ul>
  `,
  styles: `.pending { color: #999; font-style: italic; }`,
})
export class AppComponent {
  name = signal<string | null>(null);
  todosResource = createResource(() => this.#repo.getTodos());
  addTodo = createMutation(async ({name}: {name: string}) => {
    const todo = await this.#repo.addTodo({name});
    this.todosResource.set([...this.todosResource().value ?? [], todo]);
    this.name.set(null);
  });

  todos = computed(() => {
    const existingTodos = this.todosResource().value?.map(todos => ({...todos, pending: false})) ?? [];
    const todoData = this.addTodo.value();
    if (todoData) {
      return [...existingTodos, {id: generateId(), ...todoData, pending: true}];
    }
    return existingTodos;
  });

  #repo = inject(TodoRepo);

  async add() {
    const name = this.name();
    if (name == null) {
      return;
    }

    this.addTodo({name});
  }
}

let i = 0;
function generateId() {
  return (++i).toString();
}

function createMutation<T>(fn: (value: T) => Promise<void>): Mutator<T> {
  const state = signal<{error?: unknown, pending: boolean, value?: T}>({pending: false});

  const mutator = ((value: T) => {    
    const action = () => {
      state.set({pending: true, value});

      fn(value)
        .then(() => state.set({pending: false}))
        .catch(error => state.set({error, pending: false}));
    }

    mutator.retry = () => {
      if (state().pending) {
        throw new Error('Mutation has already been finalized.');
      }
      action();
    };

    action();
  }) as Mutator<T>;

  mutator.cancel = () => {
    // todo unsubscribe if observable.
    state.set({pending: false});
  }
  mutator.retry = () => {
    throw new Error('Mutation has not been initialized yet.');
  }
  mutator.error = () => state().error;
  mutator.pending = () => state().pending;
  mutator.value = () => state().value;
  
  return mutator;
}

interface Mutator<T> {
  (value: T): void;
  cancel(): void;
  retry(): void;
  pending(): boolean;
  error(): unknown;
  value(): T | undefined;
};

function createResource<T>(fn: () => Observable<T>): ResourceSignal<T> {
  const manualTriggerSubject = new BehaviorSubject<void>(undefined);
  const manualValueSubject = new Subject<T>();
  const signal = rxComputed(
    () => merge(manualTriggerSubject.pipe(exhaustMap(() => fn())), manualValueSubject).pipe(suspensify({ strict: false })),
    { initialValue: pending }
  ) as ResourceSignal<T>;
  signal.refetch = () => manualTriggerSubject.next();
  signal.set = (value) => manualValueSubject.next(value);
  return signal;
}

interface ResourceSignal<T> extends Signal<SuspenseLax<T>> {
  refetch(): void;
  set(value: T): void;
}
