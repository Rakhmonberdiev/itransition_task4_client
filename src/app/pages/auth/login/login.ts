import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../_services/auth.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal<string | null>(null);
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      isPersistent: [false],
    });
  }
  onSubmit(): void {
    if (this.form.invalid) return;
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMessage.set(
          err.status === 401
            ? 'Invalid email or password.'
            : 'Login failed, please try again.'
        );
      },
    });
  }
}
