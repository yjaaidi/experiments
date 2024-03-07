import {
  Component,
  DestroyRef,
  Injectable,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Observable, defer } from 'rxjs';
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
  async addTodo({ name }: { name: string }): Promise<Todo> {
    console.log(`✨ Adding todo: ${name}`);
    await this.#wait();

    if (name.toLocaleLowerCase().includes('error')) {
      throw new Error('Failed to add todo.');
    }

    const todo = {
      id: generateId(),
      name: name.charAt(0).toLocaleUpperCase() + name.slice(1),
    };

    this.#todos = [...this.#todos, todo];

    return todo;
  }

  getTodos() {
    console.log('🎉 Fetching todos');
    return defer(async () => {
      await this.#wait();
      return this.#todos;
    });
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
    this.#todos = this.#todos.filter((todo) => todo.id !== todoId);
  }

  #wait(duration = 500) {
    return new Promise((resolve) => setTimeout(resolve, duration));
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
        [disabled]="todosResource.pending"
        [(ngModel)]="name"
        name="name"
      />
      @if(todosResource.canRefetch) {
      <button type="button" (click)="todosResource.refetch()">REFRESH</button>
      }
    </form>

    @if(todosResource.pending) {
    <p>Loading...</p>
    }

    <ul>
      @for(todo of todos(); track todo.id) {
      <li [class.pending]="todo.addition?.pending()">
        <span>{{ todo.name }}</span>
        <span>&nbsp;</span>
        <button
          [disabled]="todo.addition || todo.deletion?.pending()"
          (click)="todo.deletion ? todo.deletion.retry() : deleteTodo(todo.id)"
        >
          DELETE
        </button>
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
  addTodo = createMutation(async ({ name }: { name: string }) => {
    const todo = await this.#repo.addTodo({ name });
    const todos =
      this.todosResource.status === 'success' ? this.todosResource() : [];
    this.todosResource.set([...todos, todo]);
    this.name.set(null);
  });
  deleteTodo = createMutation(async (todoId: string) => {
    await this.#repo.deleteTodo(todoId);
    if (this.todosResource.status === 'success') {
      this.todosResource.update((todos) =>
        todos.filter((todo) => todo.id !== todoId)
      );
    }
  });

  todos = computed<
    (Todo & { addition?: Mutation<unknown>; deletion?: Mutation<unknown> })[]
  >(() => {
    let todos =
      this.todosResource.status === 'success' ? this.todosResource() : [];
    const addTodoMutations = this.addTodo.mutations();
    const deleteTodoMutations = this.deleteTodo.mutations();

    if (addTodoMutations) {
      todos = [
        ...todos,
        ...addTodoMutations.map((mutation) => ({
          id: generateId(),
          name: mutation().name,
          addition: mutation,
        })),
      ];
    }

    if (deleteTodoMutations) {
      todos = todos.map((todo) => {
        const deletionMutation = deleteTodoMutations.find(
          (mutation) => mutation() === todo.id
        );
        if (deletionMutation) {
          return { ...todo, deletion: deletionMutation };
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

    this.addTodo({ name });
  }
}

let i = 0;
function generateId() {
  return (i++).toString();
}

function createMutation<T>(fn: (value: T) => Promise<void>): Mutator<T> {
  const mutations = signal<Mutation<T>[]>([]);

  const mutator = ((value: T) => {
    const mutationState = signal<{
      error?: unknown;
      pending: boolean;
      value: T;
    }>({ pending: true, value });
    const mutation = (() => mutationState().value) as Mutation<T>;
    mutations.update((_mutations) => [..._mutations, mutation]);

    mutation.cancel = () => {
      /* @todo unsubscribe if observable or trigger abort signal etc... */
      mutations.update((_mutations) =>
        _mutations.filter((m) => m !== mutation)
      );
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
      mutationState.set({ error: undefined, pending: true, value });
      fn(value)
        .then(() =>
          mutations.update((_mutations) =>
            _mutations.filter((m) => m !== mutation)
          )
        )
        .catch((error) => mutationState.set({ error, pending: false, value }));
    }

    action();
  }) as Mutator<T>;

  mutator.mutations = mutations.asReadonly();

  return mutator;
}

interface Mutator<T> {
  (value: T): void;
  mutations(): Mutation<T>[];
}

interface Mutation<T> {
  (): T;
  cancel(): void;
  retry(): void;
  pending(): boolean;
  error(): unknown;
}

function createResource<T>(fn: () => Observable<T>): Resource<T> {
  const destroyRef = inject(DestroyRef);
  const state = signal<Suspense<T>>({
    status: 'pending',
  });

  function action() {
    return fn()
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (value) => state.set({ status: 'success', value }),
        error: (error) => state.set({ status: 'error', error }),
      });
  }

  effect(
    (onCleanUp) => {
      state.set({ status: 'pending' });
      const sub = action();
      onCleanUp(() => sub.unsubscribe());
    },
    { allowSignalWrites: true }
  );

  const resource = (() => {
    const suspense = state();
    if (suspense.status !== 'success' && suspense.status !== 'refetching') {
      throw new Error('Resource is not in success or refetching state.');
    }
    return suspense.value;
  }) as Resource<T>;

  Object.defineProperty(resource, 'canRefetch', {
    get() {
      const status = state().status;
      return status === 'success' || status === 'error';
    },
  });

  Object.defineProperty(resource, 'pending', {
    get() {
      const status = state().status;
      return status === 'pending' || status === 'refetching';
    },
  });

  Object.defineProperty(resource, 'status', {
    get() {
      return state().status;
    },
  });

  Object.defineProperty(resource, 'error', {
    get() {
      const suspense = state();
      if (suspense.status !== 'error') {
        throw new Error('Resource is not in error state.');
      }
      return suspense.error;
    },
  });

  resource.set = (value) => state.set({ status: 'success', value });
  (resource as { update(updater: (v: T | undefined) => T): void }).update = (
    updater
  ) =>
    state.update((suspense) => {
      return {
        status: 'success',
        value: updater('value' in suspense ? suspense.value : undefined),
      };
    });

  (resource as { refetch(): void }).refetch = () => {
    const suspense = untracked(state);

    if (suspense.status === 'pending' || suspense.status === 'refetching') {
      return;
    }

    state.set({
      status: 'refetching',
      value: 'value' in suspense ? suspense.value : undefined,
    });

    action();
  };

  return resource;
}

type Resource<T> = ResourceBase<T> &
  (
    | {
        status: 'fetching';
        canRefetch: false;
        pending: true;
      }
    | {
        status: 'success';
        canRefetch: true;
        pending: false;
        (): T;
        refetch(): void;
        update: (updater: (value: T) => T) => void;
      }
    | {
        status: 'error';
        canRefetch: true;
        pending: false;
        error: unknown;
        refetch(): void;
      }
    | {
        status: 'refetching';
        canRefetch: false;
        pending: true;
        (): T | undefined;
        update: (updater: (value?: T) => T) => void;
      }
  );

interface ResourceBase<T> {
  set: (value: T) => void;
}

type Suspense<T> =
  | { status: 'pending' }
  | { status: 'success'; value: T }
  | { status: 'error'; error: unknown }
  | { status: 'refetching'; value: T | undefined };
