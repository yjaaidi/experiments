import { Component, computed, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import 'zone.js';
import { Todo, TodoRepository } from './todo.repository';
import { createResource } from './resource';
import { createMutation, Mutation } from './mutation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <p>
      💥 Typing "error" will make the submission fail.
      <br />
      💥 Deleting "Burger" will fail too.
      <br />
      This is useful to try out retries 😉.
    </p>

    <hr />

    <form (ngSubmit)="add()">
      <input [(ngModel)]="name" name="name" />

      <button [disabled]="todosResource.pending" type="submit">ADD</button>

      <button
        [disabled]="
          !todosResource.canRefetch || addTodo.pending() || deleteTodo.pending()
        "
        (click)="todosResource.canRefetch && todosResource.refetch()"
        type="button"
      >
        REFRESH
      </button>
    </form>

    @if (todosResource.pending) {
      <p>Loading...</p>
    }

    <ul>
      @for (todo of todos(); track todo.id) {
        <li [class.pending]="todo.addition?.pending()">
          <span>{{ todo.name }}</span>
          <span>&nbsp;</span>
          <button
            [disabled]="
              todosResource.pending || todo.addition || todo.deletion?.pending()
            "
            (click)="
              todo.deletion ? todo.deletion.retry() : deleteTodo(todo.id)
            "
          >
            DELETE
          </button>
          @if (todo.addition?.error()) {
            <button (click)="todo.addition?.retry()">RETRY</button>
          }
        </li>
      }
    </ul>
  `,
  styles: `
    .pending {
      color: #999;
      font-style: italic;
    }
  `,
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
        todos.filter((todo) => todo.id !== todoId),
      );
    }
  });

  todos = computed<
    (Todo & { addition?: Mutation<unknown>; deletion?: Mutation<unknown> })[]
  >(() => {
    let todos = this.todosResource.hasValue ? this.todosResource() : [];
    const addTodoMutations = this.addTodo.mutations();
    const deleteTodoMutations = this.deleteTodo.mutations();

    if (deleteTodoMutations) {
      todos = todos.map((todo) => {
        const deletionMutation = deleteTodoMutations.find(
          (mutation) => untracked(mutation) === todo.id,
        );
        if (deletionMutation) {
          return { ...todo, deletion: deletionMutation };
        }
        return todo;
      });
    }

    if (addTodoMutations) {
      let i = 0;
      todos = [
        ...todos,
        ...addTodoMutations.map((mutation) => ({
          id: `tmp-${i++}`,
          name: untracked(mutation).name,
          addition: mutation,
        })),
      ];
    }

    return todos;
  });

  #repo = inject(TodoRepository);

  async add() {
    const name = this.name();
    if (name == null) {
      return;
    }

    this.addTodo({ name });
  }
}

