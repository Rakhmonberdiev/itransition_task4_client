import { Component, effect, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../_services/auth.service';
import { ResetPasswordRequest } from '../../../_models/auth.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  form!: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  success = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const email = this.route.snapshot.queryParamMap.get('email') || '';
    const token = this.route.snapshot.queryParamMap.get('token') || '';
    this.form = fb.group(
      {
        email: [email, [Validators.required, Validators.email]],
        token: [token, Validators.required],
        newPassword: ['', Validators.required],
        confirmPwd: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
    effect(() => {
      const isLoading = this.loading();

      const controls = this.form.controls;
      if (isLoading) {
        controls['email'].disable();
        controls['token'].disable();
        controls['newPassword'].disable();
        controls['confirmPwd'].disable();
      } else {
        controls['email'].enable();
        controls['token'].enable();
        controls['newPassword'].enable();
        controls['confirmPwd'].enable();
      }
    });
  }
  get newPasswordCtrl() {
    return this.form.get('newPassword')!;
  }

  get confirmPwdCtrl() {
    return this.form.get('confirmPwd')!;
  }
  private passwordsMatch(c: AbstractControl) {
    const p1 = c.get('newPassword')?.value;
    const p2 = c.get('confirmPwd')?.value;
    return p1 === p2 ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const req: ResetPasswordRequest = {
      email: this.form.value.email,
      token: this.form.value.token,
      newPassword: this.form.value.newPassword,
    };

    this.auth
      .resetPassword(req)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.success.set(true);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 400 && err.error?.message) {
            this.errorMessage.set(err.error.message);
          } else {
            this.errorMessage.set(
              'Ошибка при сбросе пароля. Попробуйте позже.'
            );
          }
        },
      });
  }
}
