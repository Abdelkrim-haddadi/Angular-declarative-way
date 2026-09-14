---
applyTo: "**/data-access/**/*.ts"
---

# Data-access (services & state) conventions

Services in `data-access/` own state. Follow the sync-vs-async menu.

## Structure every service the same way
Group members with comments in this order:
```ts
// sources    -> Subjects / observables ending in `$`
// state      -> a single private signal<State> (or private #signal)
// selectors  -> public computed() reads
// reducers   -> connect(...).with(...) wiring (in constructor)
// effects    -> effect() for persistence / side-effects
```

Expose state as **readonly**: never let consumers mutate the signal directly. Use `computed()` selectors or `.asReadonly()`.

## A. Synchronous / local state — signals + ngxtension connect
```ts
import { Injectable, computed, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { connect } from 'ngxtension/connect';

interface ItemsState { items: Item[]; loaded: boolean; }

@Injectable({ providedIn: 'root' })
export class ItemsService {
  // state
  private state = signal<ItemsState>({ items: [], loaded: false });

  // selectors
  items = computed(() => this.state().items);
  loaded = computed(() => this.state().loaded);

  // sources
  add$ = new Subject<Item>();
  remove$ = new Subject<string>();

  constructor() {
    // reducers
    connect(this.state)
      .with(this.add$, (state, item) => ({ items: [...state.items, item] }))
      .with(this.remove$, (state, id) => ({
        items: state.items.filter((i) => i.id !== id),
      }));
  }
}
```
`linkedSignal({ source, computation })` is a fine lighter alternative when state is just a projection of a resource.

## B. Asynchronous / streams — RxJS-declarative
```ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Subject, merge } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { connect } from 'ngxtension/connect';

interface State { data: Data[]; loading: boolean; error: string | null; }

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  // state
  private state = signal<State>({ data: [], loading: true, error: null });

  // selectors
  data = computed(() => this.state().data);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  // sources
  private error$ = new Subject<string>();
  private loaded$ = this.load().pipe(
    catchError((err) => { this.error$.next(err.message); return EMPTY; }),
  );

  constructor() {
    // reducers
    const nextState$ = merge(
      this.loaded$.pipe(map((data) => ({ data, loading: false }))),
      this.error$.pipe(map((error) => ({ error, loading: false }))),
    );
    connect(this.state).with(nextState$);
  }
}
```
Choose the right flattening operator: `switchMap` (cancel previous — search), `concatMap` (queue — pagination), `exhaustMap` (ignore while busy — submits), `expand` (recursive paging), `retry`/`catchError` (resilience).

Scope the service: `providedIn: 'root'` for shared state; a bare `@Injectable()` provided at the component for per-instance state (e.g. a LoginService).
