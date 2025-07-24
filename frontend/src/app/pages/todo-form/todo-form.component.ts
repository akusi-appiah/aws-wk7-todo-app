import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router,RouterLink} from '@angular/router';
import { Todo } from '../../interfaces/todo.interface';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEdit = signal(false);
  loading = signal(false);

  todoForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: [''],
    priority: ['low'],
    completed: [false]
  });


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit.set(true);
        this.loading.set(true);
        this.todoService.getTodoById(id).subscribe(todo => {
          this.todoForm.patchValue(todo);
          this.loading.set(false);
        });
      }
    })
  }


  onSubmit() {
    if (this.todoForm.invalid) return;
    this.loading.set(true);
    const formValue = this.todoForm.value;
    
    const operation = this.isEdit()
      ? this.todoService.updateTodo(this.route.snapshot.params['id'], formValue as Partial<Todo>)
      : this.todoService.createTodo(formValue as Partial<Todo>);

    operation.subscribe({
      next: () => {
        const action = this.isEdit() ? 'updated' : 'created';
        this.notification.showSuccess(`Todo ${action} successfully`);
        this.router.navigate(['/']);
      },
      error: () => {
        this.notification.showError(`Failed to ${this.isEdit() ? 'update' : 'create'} todo`);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

}
