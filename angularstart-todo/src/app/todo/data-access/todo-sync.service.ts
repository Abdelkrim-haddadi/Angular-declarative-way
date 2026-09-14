import { Injectable, computed, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { AddTodo, Todo } from '../interfaces/todo';

interface TodoSyncState {
  todos: Todo[];
}

const STORAGE_KEY = 'angularstart-todo.sync';

@Injectable({ providedIn: 'root' })
export class TodoSyncService {
  // sources
  readonly add$ = new Subject<AddTodo>();
  readonly toggle$ = new Subject<string>();
  readonly remove$ = new Subject<string>();

  // state
  private readonly state = signal<TodoSyncState>({
    todos: this.loadFromStorage(),
  });

  // selectors
  readonly todos = computed(() => this.state().todos);

  constructor() {
    // reducers
    connect(this.state)
      .with(this.add$, (state, todo) => ({
        todos: [
          ...state.todos,
          {
            id: crypto.randomUUID(),
            title: todo.title.trim(),
            completed: false,
          },
        ],
      }))
      .with(this.toggle$, (state, id) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      }))
      .with(this.remove$, (state, id) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));

    // effects
    effect(() => {
      this.getStorage()?.setItem(STORAGE_KEY, JSON.stringify(this.todos()));
    });
  }

  private loadFromStorage(): Todo[] {
    const rawTodos = this.getStorage()?.getItem(STORAGE_KEY);
    if (!rawTodos) {
      return [];
    }

    try {
      const todos = JSON.parse(rawTodos) as Todo[];
      return Array.isArray(todos) ? todos : [];
    } catch {
      return [];
    }
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
