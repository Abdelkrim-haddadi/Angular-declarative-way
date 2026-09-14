import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Subject, merge } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { connect } from 'ngxtension/connect';
import { Todo } from '../interfaces/todo';

interface TodoAsyncState {
  data: Todo[];
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class TodoAsyncService {
  private readonly http = inject(HttpClient);

  // sources
  private readonly load$ = new Subject<void>();
  readonly reload$ = new Subject<void>();
  private readonly error$ = new Subject<string>();
  private readonly loaded$ = merge(this.load$, this.reload$).pipe(
    switchMap(() =>
      this.http.get<Todo[]>('/assets/todos.json').pipe(
        map((data) => ({ data, loading: false, error: null })),
        catchError((error: { message?: string }) => {
          this.error$.next(error.message ?? 'Unable to load todos.');
          return EMPTY;
        }),
      ),
    ),
  );

  // state
  private readonly state = signal<TodoAsyncState>({
    data: [],
    loading: true,
    error: null,
  });

  // selectors
  readonly data = computed(() => this.state().data);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor() {
    // reducers
    const nextState$ = merge(
      merge(this.load$, this.reload$).pipe(map(() => ({ loading: true, error: null }))),
      this.loaded$,
      this.error$.pipe(map((error) => ({ error, loading: false }))),
    );

    connect(this.state).with(nextState$);
    this.load$.next();
  }
}
