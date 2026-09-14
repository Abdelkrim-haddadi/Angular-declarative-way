# Angular Declarative Way

Team-shared **GitHub Copilot conventions** for building Angular features "the declarative way", mined from the [Angular Start](https://angularstart.com) reference apps (todo, quicklists, giflist, chat, advanced-forms) and their `ngxtension` / `v19-migration` branches.

Clone this repo (or copy its `.github/` folder) and Copilot will automatically suggest Angular code that follows our conventions.

## What's in here

Everything lives under `.github/` so it's versioned and shared across the team.

### Always-on instructions
| File | Applies to | Purpose |
|------|-----------|---------|
| `.github/copilot-instructions.md` | Everything | The backbone: folder architecture, smart/dumb split, modern signal APIs, the sync/async state menu, naming, routing, forms, cleanup. |

### Path-scoped instructions (`applyTo` globs)
| File | Applies to | Purpose |
|------|-----------|---------|
| `.github/instructions/data-access.instructions.md` | `**/data-access/**` | Two state styles: **sync** (signals + ngxtension `connect`) and **async** (RxJS-declarative). |
| `.github/instructions/ui-components.instructions.md` | `**/ui/**` | Dumb/presentational components (`input()`/`output()` only, never inject). |
| `.github/instructions/forms.instructions.md` | `**/*.component.ts` | Reactive forms: `nonNullable.group`, sync/async/cross-field validators, `FormArray`. |

### On-demand prompts (the "menu")
| Prompt | Generates |
|--------|-----------|
| `.github/prompts/new-feature.prompt.md` | A whole feature slice (smart + dumb + data-access + interfaces). |
| `.github/prompts/new-signal-service.prompt.md` | A **sync** service (signals + ngxtension `connect`). |
| `.github/prompts/new-rxjs-service.prompt.md` | An **async** service (RxJS-declarative). |
| `.github/prompts/new-ui-component.prompt.md` | A single dumb component. |

## Core conventions at a glance

- **Feature-sliced architecture** — organize by feature, not by type:
  ```
  <feature>/
    <feature>.component.ts     # SMART: routed, export default, injects services
    data-access/*.service.ts   # state owner(s)
    ui/*.component.ts          # DUMB: input()/output() only
    utils/*.ts                 # pure helpers, validators
  shared/  data-access/ interfaces/ ui/ utils/ guards/
  ```
- **Smart vs dumb** — smart components inject services and are `export default`; dumb components only use `input()`/`output()` and never inject.
- **Modern Angular** — signals, `input.required()`, `@if`/`@for (track)`/`@empty`, `rxResource`, `linkedSignal`; no `CommonModule` just for control flow.
- **State menu** — choose by nature of the feature:
  - **Synchronous / local** → signals + ngxtension `connect`
  - **Asynchronous / streams** → RxJS-declarative (sources merged into one `nextState$`, bridged to signals with `connect`)
- **Functional guards**, reactive forms, `effect()` + `takeUntilDestroyed()` for side-effects & cleanup.

## How to use

1. Open the project in VS Code with GitHub Copilot enabled.
2. **Editing Angular files** — the instructions apply automatically; suggestions follow our conventions.
3. **Scaffolding new code** — in Copilot Chat, run a prompt, e.g. `/new-feature`, `/new-signal-service`, `/new-rxjs-service`, `/new-ui-component`.

## Reference patterns
- Signals + `connect` (sync): quicklists / giflist `ngxtension` branches
- RxJS-declarative (async): chat, giflist async
- Forms: advanced-forms
- Guards / auth: chat
