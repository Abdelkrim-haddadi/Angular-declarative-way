# angularstart-todo

`angularstart-todo` is a runnable Angular starter app in this repository that demonstrates the declarative-way conventions.

## Angular version used

This app uses **Angular v22** (`@angular/core` and `@angular/cli` latest stable at implementation time). The requested v22 exists, so no fallback was needed.

## Node.js version used

- CI and local parity are pinned to **Node.js 26** (`.github/workflows/ci.yml` and repo-root `.nvmrc`).
- Node 26 is resolvable in `actions/setup-node`, so it is used directly instead of falling back to Node 24/22.
- The app declares `"engines": { "node": ">=22.22.3" }` because that is the Angular CLI minimum.

## Run locally

Install once at the repository root (workspace install + shared lockfile):

```bash
npm install
```

Run the app from the root:

```bash
npm start -w angularstart-todo
```

Or from this folder:

```bash
cd angularstart-todo
npm start
```

Then open `http://localhost:4200`.

## Scripts

Run from the repository root:

```bash
npm run lint -w angularstart-todo
npm run build -w angularstart-todo
npm run test -w angularstart-todo
```

You can also run the same scripts from `angularstart-todo/` directly with `npm run <script>`.

Notes:

- `npm run lint` uses the repository-root ESLint config (auto-discovered from the workspace root) so conventions are enforced consistently.
- `npm run test` runs headless (`ng test --watch=false --browsers=ChromeHeadless`).

## Angular upgrades

Keep Angular upgrades isolated to this workspace by running `ng update` from `angularstart-todo/` (or `npm run ng -w angularstart-todo -- update ...` from the root). This preserves clean app-level migration boundaries while still using a shared root install/lockfile.

## Example feature: `todo`

The `src/app/todo/` slice demonstrates both state styles:

- **Sync style**: `data-access/todo-sync.service.ts` uses signals + `ngxtension/connect` with `add$`, `toggle$`, and `remove$` sources.
- **Async style**: `data-access/todo-async.service.ts` uses RxJS-declarative state (`merge`, `switchMap`, `catchError`) and loads seed data from `public/assets/todos.json` via `HttpClient`.

The route is lazy-loaded at `/todo`, with a strict smart/dumb split:

- smart container: `todo.component.ts` (default export, injects services)
- dumb components: `ui/todo-input.component.ts`, `ui/todo-list.component.ts` (inputs/outputs only, no DI)
