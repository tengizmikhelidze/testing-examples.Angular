import { Routes } from '@angular/router';
import { TodoFormComponent } from './todo/form/todo-form.component';
];
  { path: 'todo/new', loadComponent: () => Promise.resolve(TodoFormComponent) }
export const routes: Routes = [
