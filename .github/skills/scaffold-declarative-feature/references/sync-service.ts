import { Injectable, computed, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { connect } from 'ngxtension/connect';
// Replace Entity / AddEntity with the real types from interfaces/.

interface EntityState {
  items: Entity[];
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class FeatureService {
  // state
  private state = signal<EntityState>({ items: [], loaded: false });

  // selectors
  items = computed(() => this.state().items);
  loaded = computed(() => this.state().loaded);

  // sources
  add$ = new Subject<AddEntity>();
  remove$ = new Subject<string>();

  constructor() {
    // reducers
    connect(this.state)
      .with(this.add$, (state, entity) => ({
        items: [...state.items, { ...entity, id: Date.now().toString() }],
      }))
      .with(this.remove$, (state, id) => ({
        items: state.items.filter((i) => i.id !== id),
      }));
  }
}
