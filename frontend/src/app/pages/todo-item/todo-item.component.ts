import { Component, input, output } from '@angular/core';
import { Todo } from '../../interfaces/todo.interface';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [TitleCasePipe,  DatePipe,RouterLink,CommonModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent {
  todo = input<Todo>();
  delete = output<string>();
  statusChange = output<boolean>();

  get priorityClass() {
    return {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    }[this.todo()!.priority || 'low'];
  }

  toggleStatus() {
    this.statusChange.emit(!this.todo()!.completed);
  }
}
