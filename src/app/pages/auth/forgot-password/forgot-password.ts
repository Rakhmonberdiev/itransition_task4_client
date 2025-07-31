import { Component, effect, signal } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  form!: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  success = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    effect(() => {
      const isLoading = this.loading();
      const control = this.form.get('email')!;
      isLoading ? control.disable() : control.enable();
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const email = this.form.value.email;
    this.authService
      .forgotPassword({ email })
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/login']), 5000);
        },
        error: (err) => {
          if (err.status === 400 && err.error.message) {
            const msg = (err.error as { message: string }).message;
            this.errorMessage.set(msg);
          } else {
            this.errorMessage.set('Server error. Try again later.');
          }
        },
      });
  }
}
