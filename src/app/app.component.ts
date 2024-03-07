import {
  Component,
  Injectable,
  Signal,
  computed,
  inject,
  signal,
  untracked
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
import { BehaviorSubject, Observable, Subject, defer, exhaustMap, merge } from 'rxjs';
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

  /**
   * If the name contains "error", it will throw an error.
   */
  async addTodo({name}: { name: string }): Promise<Todo> {
    console.log(`✨ Adding todo: ${name}`);
    await this.#wait();
    
    if (name.toLocaleLowerCase().includes('error')) {
      throw new Error('Failed to add todo.');
    }

    return {
      id: generateId(),
      name: name.charAt(0).toLocaleUpperCase() + name.slice(1),
    }
  }

  getTodos() {
    console.log('👉 Fetching todos');
    return defer(async () => {
      await this.#wait();
      return this.#todos;
    })
  }

  /**
   * If the todoId is "0", it will throw an error.
   */
  async deleteTodo(todoId: string) {
    console.log(`🗑️ Deleting todo ${todoId}`);
    await this.#wait();
    if (todoId === '0') {
      throw new Error('Failed to delete todo.');
    }
    this.#todos = this.#todos.filter(todo => todo.id !== todoId);
  }

  #wait(duration = 500) {
    return new Promise(resolve => setTimeout(resolve, duration));
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
    <form (ngSubmit)="add()">
      <input
        [disabled]="todosResource().pending" 
        [(ngModel)]="name"
        name="name"/>
    </form>

    @if(todosResource().pending) {
      <p>Loading...</p>
    }
    
    <ul>
      @for(todo of todos(); track todo.id) {
        <li [class.pending]="todo.addition?.pending()">
          <span>{{todo.name}}</span>
          <span>&nbsp;</span>
          <button [disabled]="todo.addition || todo.deletion?.pending()" (click)="todo.deletion ? todo.deletion.retry() : deleteTodo(todo.id)">DELETE</button>
          @if(todo.addition?.error()) {
            <button (click)="todo.addition?.retry()">RETRY</button>
          }
        </li>
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
  deleteTodo = createMutation(async (todoId: string) => {
    await this.#repo.deleteTodo(todoId);
    const todos = this.todosResource().value;
    if (todos) {
      this.todosResource.set(todos.filter(todo => todo.id !== todoId));
    }
  })

  todos = computed<(Todo & {addition?: Mutation<unknown>; deletion?: Mutation<unknown>})[]>(() => {
    let todos = this.todosResource().value ?? [];
    const addTodoMutations = this.addTodo.mutations();
    const deleteTodoMutations = this.deleteTodo.mutations();

    if (addTodoMutations) {
      todos = [...todos, ...addTodoMutations.map((mutation) => ({id: generateId(), name: mutation().name, addition: mutation}))];
    }

    if (deleteTodoMutations) {
      todos = todos.map(todo => {
        const deletionMutation = deleteTodoMutations.find(mutation => mutation() === todo.id);
        if (deletionMutation) {
          return {...todo, deletion: deletionMutation};
        }
        return todo;
      });
    }

    return todos;
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
  return (i++).toString();
}

function createMutation<T>(fn: (value: T) => Promise<void>): Mutator<T> {
  const mutations = signal<Mutation<T>[]>([]);

  const mutator = ((value: T) => {    
    const mutationState = signal<{error?: unknown, pending: boolean, value: T}>({pending: true, value});
    const mutation = (() => mutationState().value) as Mutation<T>;
    mutations.update(_mutations => [..._mutations, mutation]);

    mutation.cancel = () => {
      /* @todo unsubscribe if observable or trigger abort signal etc... */
      mutations.update(_mutations => _mutations.filter(m => m !== mutation));
    };

    mutation.retry = () => {
      if (mutationState().pending) {
        throw new Error('Mutation has already been finalized.');
      }
      action();
    };

    mutation.error = () => mutationState().error;
    mutation.pending = () => mutationState().pending;

    function action() {
      mutationState.set({error: undefined, pending: true, value})
      fn(value)
        .then(() => mutations.update(_mutations => _mutations.filter(m => m !== mutation)))
        .catch(error => mutationState.set({error, pending: false, value}));
    };

    action();
  }) as Mutator<T>;

  mutator.mutations = mutations.asReadonly();

  return mutator;
}

interface Mutator<T> {
  (value: T): void;
  mutations(): Mutation<T>[];
};

interface Mutation<T> {
  (): T;
  cancel(): void;
  retry(): void;
  pending(): boolean;
  error(): unknown;
}

function createResource<T>(fn: () => Observable<T>): ResourceSignal<T> {
  const manualTriggerSubject = new BehaviorSubject<void>(undefined);
  const manualValueSubject = new Subject<T>();
  const signal = rxComputed(
    () => merge(manualTriggerSubject.pipe(exhaustMap(() => fn())), manualValueSubject).pipe(suspensify({ strict: false })),
    { initialValue: pending }
  ) as ResourceSignal<T>;
  signal.refetch = () => manualTriggerSubject.next();
  signal.set = (value) => manualValueSubject.next(value);
  signal.update = (updater) => signal.set(updater(untracked(() => signal().value)));
  return signal;
}

interface ResourceSignal<T> extends Signal<SuspenseLax<T>> {
  refetch(): void;
  set(value: T): void;
  update(updater: (value?: T) => T): void;
}
