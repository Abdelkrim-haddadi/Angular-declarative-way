export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type AddTodo = Omit<Todo, 'id' | 'completed'>;
