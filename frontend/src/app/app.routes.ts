import { Routes } from '@angular/router';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { TodoFormComponent } from './pages/todo-form/todo-form.component';

export const routes: Routes = [
  { path: '', component: TodoListComponent,title: "Home" },
  { path: 'new', component: TodoFormComponent,title: "Create Todo" },
  { path: 'edit/:id', component: TodoFormComponent,title: "Edit Todo" },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
