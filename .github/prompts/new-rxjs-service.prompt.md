---
mode: agent
description: Create a data-access service for ASYNCHRONOUS/stream state using RxJS-declarative + connect.
---

# New RxJS-declarative service (async state)

Generate a service in `data-access/` for **asynchronous/stream-heavy** state (HTTP, Firestore, websockets, debounced search, pagination).

Use:
- `private state = signal<State>({ ..., loading, error })`
- public `computed()` selectors
- **sources** as `Subject`s / observables ending in `$`
- combine into one `nextState$` via `merge`
- express async with the correct operator: `switchMap` (search/cancel), `concatMap` (pagination), `exhaustMap` (submits), `expand` (recursive paging), plus `retry` / `catchError`
- bridge with `connect(this.state).with(nextState$)`

Group members with `// sources`, `// state`, `// selectors`, `// reducers` comments. Handle errors through a dedicated `error$` source.
