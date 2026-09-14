/**
 * Global Vitest setup for angularstart-todo.
 *
 * The `@angular/build:unit-test` builder runs specs through Vitest. Depending
 * on the runner environment, the browser `localStorage` API may not be
 * available (the Node runner logs:
 *   "localStorage is not available because --localstorage-file was not provided").
 *
 * `TodoSyncService` reads/writes `localStorage` on construction, so we install
 * a minimal in-memory implementation when one is missing. This keeps the
 * service code free of test-only guards while making specs deterministic.
 */

class LocalStorageMock implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

function ensureLocalStorage(): void {
  const hasWorkingLocalStorage = (() => {
    try {
      return (
        typeof globalThis.localStorage !== 'undefined' &&
        globalThis.localStorage !== null
      );
    } catch {
      return false;
    }
  })();

  if (!hasWorkingLocalStorage) {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      writable: true,
      value: new LocalStorageMock(),
    });
  }
}

ensureLocalStorage();

// Start every test from a clean slate.
beforeEach(() => {
  globalThis.localStorage?.clear();
});
