import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TodoFormComponent} from './todo-form.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {Todo} from '../../shared/interfaces/todo.interface';

describe('TodoFormComponent / Reactive Form Tests', () => {
  let fixture: ComponentFixture<TodoFormComponent>;
  let component: TodoFormComponent;
  let https: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    https = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // initial binding
  });

  afterEach(() => https.verify());

  function setTitle(value: string) {
    component.title?.setValue(value);
    component.title?.markAsTouched();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  it('should start with invalid form (empty title)', () => {
    expect(component.form.invalid).toBeTrue();
    expect(component.title?.errors?.['required']).toBeTrue();
  });

  it('should validate minLength >= 3', () => {
    setTitle('ab');
    expect(component.title?.errors?.['minlength']).toBeTruthy();
    setTitle('abc');
    expect(component.title?.errors).toBeNull();
  });

  it('should invalidate whitespace-only title', () => {
    setTitle('    ');
    expect(component.title?.errors?.['whitespace']).toBeTrue();
  });

  it('should enable submit button only when form valid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
    setTitle('Valid Title');
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  it('should not submit when invalid', () => {
    spyOn(component as any, 'submit').and.callThrough();
    component.submit();
    expect((component as any).submit).toHaveBeenCalled();
    // No HTTP should be fired
    https.expectNone(`${environment.todoUrl}`);
  });

  it('should trim title before submit and call service', () => {
    setTitle('   Trim Me   ');
    component.completed?.setValue(true);
    fixture.detectChanges();
    component.submit();
    const req = https.expectOne(`${environment.todoUrl}`);
    expect(req.request.method).toBe('POST');
    const body: Todo = req.request.body;
    expect(body.title).toBe('Trim Me');
    expect(body.completed).toBeTrue();
    req.flush({...body, id: 101});
    expect(component.lastCreated?.id).toBe(101);
    expect(component.form.value.title).toBe('');
    expect(component.form.value.completed).toBeFalse();
  });

  it('should handle service error and keep form data', () => {
    setTitle('Error Case');
    component.submit();
    const req = https.expectOne(`${environment.todoUrl}`);
    req.flush({ message: 'Boom' }, { status: 500, statusText: 'Server Error' });
    expect(component.errorMessage).toBeTruthy();
    expect(component.form.value.title).toBe('Error Case');
  });

  it('should allow very long valid title', () => {
    const longTitle = 'x'.repeat(1000);
    setTitle(longTitle);
    expect(component.title?.valid).toBeTrue();
  });

  it('should toggle completed checkbox', () => {
    expect(component.completed?.value).toBeFalse();
    component.completed?.setValue(true);
    expect(component.completed?.value).toBeTrue();
  });
});
