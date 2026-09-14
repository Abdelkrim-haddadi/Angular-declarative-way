import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoAsyncService } from './data-access/todo-async.service';
import { TodoSyncService } from './data-access/todo-sync.service';
import { TodoInputComponent } from './ui/todo-input.component';
import { TodoListComponent } from './ui/todo-list.component';

@Component({
  selector: 'app-todo',
  imports: [TodoInputComponent, TodoListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="todo-page">
      <h1>Angular Declarative Todo</h1>

      <section>
        <h2>Sync state (signals + ngxtension connect)</h2>
        <app-todo-input (addTodo)="todoSyncService.add$.next({ title: $event })" />
        <app-todo-list
          [todos]="todoSyncService.todos()"
          (toggleTodo)="todoSyncService.toggle$.next($event)"
          (removeTodo)="todoSyncService.remove$.next($event)"
        />
      </section>

      <section>
        <h2>Async state (RxJS declarative + HttpClient)</h2>
        <button type="button" (click)="todoAsyncService.reload$.next()">Reload seeded todos</button>

        @if (todoAsyncService.loading()) {
          <p>Loading seeded todos...</p>
        } @else if (todoAsyncService.error(); as error) {
          <p>Failed to load: {{ error }}</p>
        } @else {
          <app-todo-list [todos]="todoAsyncService.data()" />
        }
      </section>
    </main>
  `,
  styles: [
    `
      .todo-page {
        margin-inline: auto;
        max-width: 40rem;
        padding: 1rem;
      }

      section {
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        margin-block: 1rem;
        padding: 1rem;
      }
    `,
  ],
})
export default class TodoComponent {
  readonly todoSyncService = inject(TodoSyncService);
  readonly todoAsyncService = inject(TodoAsyncService);
}
