import { TestBed } from '@angular/core/testing';
import { TodoSyncService } from './todo-sync.service';

describe('TodoSyncService', () => {
  let service: TodoSyncService;

  beforeEach(() => {
    // localStorage is cleared globally in src/test-setup.ts before each test.
    TestBed.configureTestingModule({});
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
