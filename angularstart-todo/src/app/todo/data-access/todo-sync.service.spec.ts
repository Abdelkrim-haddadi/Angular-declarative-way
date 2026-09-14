import { inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE, TodoSyncService } from './todo-sync.service';

describe('TodoSyncService', () => {
  let service: TodoSyncService;
  let localStorage: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage = TestBed.runInInjectionContext(() => inject(LOCAL_STORAGE));
    localStorage.clear();
    service = TestBed.inject(TodoSyncService);
  });

  it('adds, toggles, and removes todos', () => {
    service.add$.next({ title: 'Write a spec' });

    expect(service.todos().length).toBe(1);
    const [todo] = service.todos();
    expect(todo.title).toBe('Write a spec');
    expect(todo.completed).toBe(false);

    service.toggle$.next(todo.id);
    expect(service.todos()[0]?.completed).toBe(true);

    service.remove$.next(todo.id);
    expect(service.todos()).toEqual([]);
  });
});
