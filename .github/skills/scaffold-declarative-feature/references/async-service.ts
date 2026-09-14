import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Subject, merge } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { connect } from 'ngxtension/connect';
// Replace Entity with the real type from interfaces/.

interface EntityState {
  items: Entity[];
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly http = inject(HttpClient);

  // state
  private readonly state = signal<EntityState>({
    items: [],
    loading: true,
    error: null,
  });

  // selectors
  readonly items = computed(() => this.state().items);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  // sources
  private readonly error$ = new Subject<string>();
  private readonly loaded$ = this.http.get<Entity[]>('/api/entities').pipe(
    catchError((err) => {
      this.error$.next(err.message);
      return EMPTY;
    }),
  );
  readonly reload$ = new Subject<void>();

  constructor() {
    // reducers
    const nextState$ = merge(
      this.loaded$.pipe(map((items) => ({ items, loading: false }))),
      this.error$.pipe(map((error) => ({ error, loading: false }))),
      this.reload$.pipe(
        switchMap(() => this.http.get<Entity[]>('/api/entities')),
        map((items) => ({ items })),
      ),
    );
    connect(this.state).with(nextState$);
  }
}
