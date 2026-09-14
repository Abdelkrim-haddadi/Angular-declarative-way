---
applyTo: "**/ui/**/*.ts"
---

# UI (dumb / presentational) component conventions

Components in `ui/` are **pure and presentational**.

## Rules
- NEVER `inject()` a service or router here.
- Inputs only via `input()` / `input.required<T>()`.
- Outputs only via `output<T>()`.
- Use `export class` (named export) — these are `imports:`-ed by smart components.
- Prefer inline template + inline `styles: [...]`.
- Use `@if` / `@for (... ; track ...)` / `@empty`. Do not import `CommonModule` for control flow.
- No business logic or async data fetching — emit events and let the smart parent decide.

## Template example
```ts
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-item-list',
  template: `
    <ul>
      @for (item of items(); track item.id) {
        <li>
          {{ item.title }}
          <button (click)="delete.emit(item.id)">Delete</button>
        </li>
      } @empty {
        <li>Nothing here yet!</li>
      }
    </ul>
  `,
})
export class ItemListComponent {
  items = input.required<Item[]>();
  delete = output<string>();
}
```

## Local view state
If a dumb component needs internal view state (e.g. a media player toggle), a small local `signal()` + `computed()` is fine — but it must stay self-contained and never reach into app state.
