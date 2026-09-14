import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Todo } from '../interfaces/todo';

@Component({
  selector: 'app-todo-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="todo-list">
      @for (todo of todos(); track todo.id) {
        <li>
          <button type="button" (click)="toggleTodo.emit(todo.id)">
            {{ todo.completed ? '✅' : '⬜️' }}
          </button>
          <span [class.completed]="todo.completed">{{ todo.title }}</span>
          <button type="button" (click)="removeTodo.emit(todo.id)">Remove</button>
        </li>
      } @empty {
        <li>No todos yet.</li>
      }
    </ul>
  `,
  styles: [
    `
      .todo-list {
        list-style: none;
        padding: 0;
      }

      li {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        margin-block: 0.5rem;
      }

      .completed {
        color: #666;
        text-decoration: line-through;
      }
    `,
  ],
})
export class TodoListComponent {
  readonly todos = input.required<Todo[]>();
  readonly toggleTodo = output<string>();
  readonly removeTodo = output<string>();
}
