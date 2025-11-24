import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule} from '@angular/forms';
import {TodoService} from '../services/todo.service';
import {Todo} from '../../shared/interfaces/todo.interface';
import {CommonModule} from '@angular/common';

// Simple interface for creating new todos without id yet
export interface NewTodo {
  title: string;
  completed: boolean;
}

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '') as string;
  if (value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), noWhitespaceValidator]],
    completed: [false]
  });

  submitting = false;
  errorMessage: string | null = null;
  lastCreated: Todo | null = null;

  get title(): AbstractControl | null { return this.form.get('title'); }
  get completed(): AbstractControl | null { return this.form.get('completed'); }

  submit(): void {
    this.errorMessage = null;
    this.lastCreated = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value as NewTodo;
    const trimmedTitle = raw.title.trim();
    // Extra guard in case user entered leading/trailing whitespace causing minLength to pass erroneously
    if (trimmedTitle.length < 3) {
      this.title?.setErrors({ minlength: true });
      return;
    }
    const payload: Todo = { id: 0, title: trimmedTitle, completed: !!raw.completed };
    this.submitting = true;
    this.todoService.add(payload).subscribe({
      next: (created) => {
        this.lastCreated = created;
        this.submitting = false;
        // Reset but keep completed default false
        this.form.reset({ title: '', completed: false });
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = 'Failed to add todo';
        // keep user input for correction
      }
    });
  }
}

