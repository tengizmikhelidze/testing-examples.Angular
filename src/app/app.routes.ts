import { Routes } from '@angular/router';
import { TodoFormComponent } from './todo/form/todo-form.component';
import { ExampleComponent } from './example/example.component';

export const routes: Routes = [
  { path: '', redirectTo: '/examples', pathMatch: 'full' },
  { path: 'examples', loadComponent: () => Promise.resolve(ExampleComponent) },
  { path: 'todo/new', loadComponent: () => Promise.resolve(TodoFormComponent) }
];
