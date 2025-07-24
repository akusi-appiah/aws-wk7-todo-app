import { Component,computed,inject,signal  } from '@angular/core';
import { TodoService } from '../../services/todo.service';
// import { NotificationService } from '../../services/notification.service';
import { Todo, TodoFilterStatus } from '../../interfaces/todo.interface';
import { AsyncPipe, DatePipe,TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoItemComponent } from '../todo-item/todo-item.component';


@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink,TitleCasePipe, TodoItemComponent],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {
  private readonly todoService = inject(TodoService);
  // private notification = inject(NotificationService);

  todos = signal<Todo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  filterStatus = signal<TodoFilterStatus>('all');

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.loading.set(true);
    this.error.set(null);

    this.todoService.getAllTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
      },
      error: (err) => {
        this.error.set('Failed to load todos. Please try again later.');
        // this.notification.showError(this.error()!);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  handleDelete(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update(todos => todos.filter(t => t.id !== id));
        // this.notification.showSuccess('Todo deleted successfully');
      },
      // error: () => this.notification.showError('Failed to delete todo')
    });
  }



  filteredTodos= computed((): Todo[] => {
    return this.todos().filter(todo => {
      if (this.filterStatus() === 'active') return !todo.completed;
      if (this.filterStatus() === 'completed') return todo.completed;
      return true;
    });
  });

  handleStatusChange(id: string, completed: boolean) {
    this.todoService.toggleTodoStatus(id, completed).subscribe({
      next: (updatedTodo) => {
        this.todos.update(todos => 
          todos.map(t => t.id === id ? updatedTodo : t)
        );
        const action = completed ? 'completed' : 'marked as active';
        // this.notification.showSuccess(`Todo ${action} successfully`);
      },
      // error: () => this.notification.showError('Failed to update todo status')
    });
  }

  setFilter(status:string) {
    this.filterStatus.set(status as TodoFilterStatus);
  }

}
