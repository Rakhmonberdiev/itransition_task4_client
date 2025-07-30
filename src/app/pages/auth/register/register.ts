import { Component, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../../_models/auth.models';
import { AuthService } from '../../../_services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  form!: FormGroup;
  loading = signal(false);
  errorMessages = signal<string[] | null>(null);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const payload: RegisterRequest = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService
      .register(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          const allMessages: string[] = err.error?.errors
            ? Object.values<string[]>(err.error.errors).flat()
            : [
                err.error?.message ||
                  'Registration failed. Please try again later.',
              ];
          this.errorMessages.set(allMessages);
        },
      });
  }
  get fullNameControl() {
    return this.form.get('fullName')!;
  }
  get emailControl() {
    return this.form.get('email')!;
  }
  get passwordControl() {
    return this.form.get('password')!;
  }
}
