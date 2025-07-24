import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../interfaces/todo.interface';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${this.getBaseUrl()}/todos`;

  private getBaseUrl(): string {
    // Use relative path in production, localhost in development
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : '';
  }

  getTodoById(id: string) {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  getAllTodos() {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  createTodo(todo: Partial<Todo>) {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(id: string, todo: Partial<Todo>) {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleTodoStatus(id: string, completed: boolean) {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/status`, { completed });
  }
}