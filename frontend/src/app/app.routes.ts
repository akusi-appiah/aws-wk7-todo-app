import { Routes } from '@angular/router';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { TodoFormComponent } from './pages/todo-form/todo-form.component';

export const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'new', component: TodoFormComponent },
  { path: 'edit/:id', component: TodoFormComponent },
  { path: '**', redirectTo: '' }
];
