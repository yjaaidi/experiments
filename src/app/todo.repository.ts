import { Injectable } from '@angular/core';
import { defer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoRepository {
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

export interface Todo {
  id: string;
  name: string;
}

let i = 0;
function generateId() {
  return (i++).toString();
}
