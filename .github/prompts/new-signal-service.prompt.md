---
mode: agent
description: Create a data-access service for SYNCHRONOUS/local state using signals + ngxtension connect.
---

# New signal service (sync state)

Generate a service in `data-access/` for **local/synchronous** state.

Use:
- `private state = signal<State>({...})`
- public `computed()` selectors
- `Subject` **sources** ending in `$`
- `connect(this.state).with(source$, reducer)` in the constructor
- `effect()` for persistence if needed

Expose state read-only (selectors only). Group members with `// sources`, `// state`, `// selectors`, `// reducers`, `// effects` comments. For simple resource projections, `linkedSignal({ source, computation })` is acceptable.
