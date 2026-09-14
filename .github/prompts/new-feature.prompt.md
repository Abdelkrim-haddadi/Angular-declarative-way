---
mode: agent
description: Scaffold a complete declarative Angular feature slice (smart + dumb + data-access + interfaces).
---

# New feature slice

Create a full feature slice following this repo's `.github/copilot-instructions.md`.

Ask me (or infer from my request):
1. **Feature name** (e.g. `checklist`).
2. Is the primary state **synchronous/local** (→ signals + ngxtension `connect`) or **asynchronous/streams** (→ RxJS-declarative)?
3. What data/entities are involved.

Then generate:

```
<feature>/
  <feature>.component.ts        # SMART: export default, injects service, inline template
  data-access/<feature>.service.ts
  ui/<feature>-list.component.ts # DUMB: input()/output() only
  interfaces/<entity>.ts
```

Requirements:
- Smart component is the routed `export default class`, injects the service, wires dumb outputs to service sources.
- Dumb components use only `input.required()` / `output()`, never inject.
- Service follows the chosen state style with `// sources / state / selectors / reducers / effects` sections.
- Use `@if`/`@for (track)`/`@empty`, signal APIs, no `CommonModule` for control flow.
- Add a `loadComponent` route entry if a routes file exists.
