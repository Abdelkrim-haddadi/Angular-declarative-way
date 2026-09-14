import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-todo-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="todo-input"
      (submit)="submit(titleInput.value); titleInput.value = ''; $event.preventDefault()"
    >
      <input #titleInput name="title" placeholder="Add a todo" aria-label="Todo title" />
      <button type="submit">Add</button>
    </form>
  `,
  styles: [
    `
      .todo-input {
        display: flex;
        gap: 0.5rem;
      }

      input {
        flex: 1;
        padding: 0.5rem;
      }
    `,
  ],
})
export class TodoInputComponent {
  readonly addTodo = output<string>();

  submit(title: string): void {
    const nextTitle = title.trim();
    if (!nextTitle) {
      return;
    }

    this.addTodo.emit(nextTitle);
  }
}
