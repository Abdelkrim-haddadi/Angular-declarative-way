---
name: scaffold-declarative-feature
description: >-
  Scaffold a complete, convention-compliant Angular feature slice (smart
  container + dumb presentational components + data-access service +
  interfaces + route). Use this whenever a new Angular feature, page, screen,
  or CRUD section needs to be created in a repo that follows the
  "declarative way" conventions (feature-sliced architecture, standalone
  signal components, ngxtension for sync state, RxJS-declarative for async
  state). Invoke it for requests like "add a <feature> feature", "create a
  page for <entity>", "scaffold <feature>", or "build the <feature> screen".
---

# Scaffold a declarative Angular feature slice

You are generating a full Angular feature slice. Follow these conventions
**exactly**. If the repository has a `.github/copilot-instructions.md`, treat
it as the source of truth and defer to it on any conflict.

## Step 1 — Gather inputs

Determine (ask only if it cannot be inferred from the request):

1. **Feature name** — kebab-case, e.g. `checklist`, `user-profile`.
2. **Primary entity/entities** and their fields.
3. **State nature** — decide the style:
   - **Synchronous / local** (in-memory collection, UI state, form-driven)
     → signals + ngxtension `connect`.
   - **Asynchronous / streams** (HTTP, Firestore, websockets, debounced
     search, pagination, retries) → RxJS-declarative.

## Step 2 — Detect the workspace

- Find the app source root (usually `src/app` or a Nx `apps/*/src/app`).
- Detect the Angular version from `package.json`. On v19+, omit the redundant
  `standalone: true`. Below v19, include `standalone: true`.
- Detect whether `ngxtension` is a dependency. If the sync style is chosen and
  it is missing, add it to `package.json` dependencies and note this to the user.
- Locate the routes file (`*.routes.ts`) to register a lazy route.

## Step 3 — Generate the slice

Create this structure under the feature folder:

```
<feature>/
  <feature>.component.ts            # SMART container
  data-access/<feature>.service.ts  # state owner
  ui/<feature>-list.component.ts    # DUMB presentational
  interfaces/<entity>.ts            # types
```

### Smart component (`<feature>.component.ts`)
- `export default class`, `selector: 'app-<feature>'`.
- `inject()` the service; expose its selectors to the template.
- Wire dumb-component outputs to service sources
  (`(add)="service.add$.next($event)"`).
- Inline template using `@if` / `@for (…; track …)` / `@empty`.
- No `CommonModule` for control flow.

### Dumb component (`ui/<feature>-list.component.ts`)
- `export class` (named export), `selector: 'app-<feature>-list'`.
- Inputs via `input.required<T>()`; outputs via `output<T>()`.
- **Never** `inject()` a service or router.
- Inline template + inline `styles: [...]`.

### Data-access service (`data-access/<feature>.service.ts`)
Group members with `// sources`, `// state`, `// selectors`, `// reducers`,
`// effects` comments. Expose state **read-only** (computed selectors).

Use the matching template from `references/` below.

### Interfaces (`interfaces/<entity>.ts`)
- One interface per concept. Add `Add<Entity>` / `Edit<Entity>` helper types
  where mutations exist (omit server-generated fields like `id`).

## Step 4 — Register the route

If a routes file exists, add a lazy entry:

```ts
{
  path: '<feature>',
  loadComponent: () =>
    import('./<feature>/<feature>.component'),
}
```

## Step 5 — Verify

- Confirm dumb components contain no `inject(`.
- Confirm no `*ngIf` / `*ngFor` / `CommonModule` used for control flow.
- Confirm the service exposes only read-only selectors.
- If ESLint is configured, run it on the generated files and fix violations.
- Summarize what was created and which state style was chosen (and why).

## Reference templates

- Synchronous state: `references/sync-service.ts`
- Asynchronous state: `references/async-service.ts`
