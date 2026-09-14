---
mode: agent
description: Create a dumb/presentational Angular component (input()/output() only).
---

# New UI (dumb) component

Generate a presentational component in a `ui/` folder.

Rules:
- `export class` (named export).
- Inputs via `input()` / `input.required<T>()`; outputs via `output<T>()`.
- NEVER inject a service or router.
- Inline template using `@if` / `@for (... ; track ...)` / `@empty`; no `CommonModule` for control flow.
- Inline `styles: [...]`.
- No data fetching or business logic — emit events for the smart parent to handle.
- Local view-only `signal()`/`computed()` is allowed if fully self-contained.
