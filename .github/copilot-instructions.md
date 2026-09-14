# Angular Declarative Way — Copilot Instructions

These conventions apply to **all Angular/TypeScript code** in this repository. They are mined from the Angular Start reference apps (todo, quicklists, giflist, chat, advanced-forms) and their `ngxtension` / `v19-migration` branches. Follow them automatically for every suggestion.

## 1. Folder architecture (feature-sliced)

Organize code by **feature**, never by type. Every feature slice looks like:

```
<feature>/
  <feature>.component.ts       # SMART component (routed, default export, injects services)
  data-access/*.service.ts     # state owner(s)
  ui/*.component.ts            # DUMB/presentational components (input()/output() only)
  utils/*.ts                   # pure helpers, validators
shared/
  data-access/  interfaces/  ui/  utils/  guards/
```

- Cross-feature code goes in `shared/`.
- One component/service per file. Filenames: `kebab-case.component.ts`, `kebab-case.service.ts`.
- Interfaces live in `interfaces/`, one concept per file (optionally re-exported via `interfaces/index.ts`).

## 2. Smart vs. dumb components (strict)

**Smart (container) components:**
- Are the routed component; use `export default class`.
- `inject()` services and expose their state to the template.
- Wire dumb-component outputs to service sources (`(add)="service.add$.next($event)"`).

**Dumb (presentational) components:**
- NEVER `inject()` a service.
- Receive data only via `input.required<T>()` / `input<T>()`.
- Emit only via `output<T>()`.
- Are `imports:`-ed by smart components. Use `export class` (named export).

## 3. Modern Angular APIs (always prefer)

- Standalone components (no NgModules). On v19+, omit the redundant `standalone: true`.
- Signal inputs/outputs: `input()`, `input.required()`, `output()`, `model()`.
- Signal queries: `viewChild.required()`, `contentChild()`.
- Built-in control flow `@if` / `@for` (with `track`) / `@empty` / `@switch`. Do NOT import `CommonModule` just for `*ngIf`/`*ngFor`.
- State: `signal()`, `computed()`, `linkedSignal()`, `effect()`.
- Async data: `rxResource()` / `resource()`.
- RxJS interop: `toSignal()`, `toObservable()`, `takeUntilDestroyed()`.
- Inline templates for small components; keep styles inline via `styles: [...]`.

## 4. Two state styles — pick by sync vs async

This repo deliberately offers a **menu**. Choose based on the nature of the feature:

### Synchronous / local state → **signals + ngxtension `connect`**
Use for local UI state, in-memory collections, form-driven state.

```ts
private state = signal<State>({ items: [], loaded: false });
// selectors
items = computed(() => this.state().items);
// sources
add$ = new Subject<Item>();
constructor() {
  connect(this.state)
    .with(this.add$, (state, item) => ({ items: [...state.items, item] }));
}
```

For simple resource-backed collections, `linkedSignal({ source, computation })` is also acceptable (see quicklists).

### Asynchronous / stream-heavy state → **RxJS-declarative**
Use for HTTP, websockets/Firestore, debounced search, pagination, retries.

- Model inputs as **sources** (`Subject`s / observables), named with a `$` suffix.
- Combine them into a single `nextState$` via `merge`.
- Express async with operators: `switchMap`, `concatMap`, `exhaustMap`, `expand`, `retry`, `catchError`.
- Bridge to signals with `connect(this.state).with(nextState$)`.
- Expose everything to templates as `computed()` selectors.

## 5. Naming conventions

- Observable/source fields end with `$`: `add$`, `error$`, `login$`, `gifsLoaded$`.
- Group service members with comments: `// sources`, `// state`, `// selectors`, `// reducers`, `// effects`.
- Services expose **readonly** state: private `#signal` + `.asReadonly()`, or private `state` signal + public `computed` selectors.

## 6. Routing & guards

- Lazy-load routed components with `loadComponent: () => import('...').then(m => m.default)` (smart components are default exports).
- Use **functional guards** (`CanActivateFn` + `inject`), returning `true` or `router.parseUrl('...')`.

## 7. Forms

- Reactive forms via `fb.nonNullable.group({...})`.
- Sync + async validators; cross-field validators at the group level.
- `FormArray` for dynamic lists.
- Bridge form status to signals: `toSignal(control.statusChanges)`.
- Sync signals ↔ form with an `effect()` (e.g. `patchValue` / `reset`).

## 8. Side effects & cleanup

- Persist/side-effect via `effect()`.
- Always `takeUntilDestroyed()` for manual subscriptions.
- Guard resource-dependent effects on status (e.g. `ResourceStatus.Resolved`).

## Reference apps
- Signals + connect (sync): quicklists / giflist `ngxtension` branches
- RxJS-declarative (async): chat, giflist async
- Forms: advanced-forms
- Guards/auth: chat
