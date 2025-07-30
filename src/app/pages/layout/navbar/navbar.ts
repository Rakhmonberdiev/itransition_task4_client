import {
  Component,
  DOCUMENT,
  inject,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrentUserService } from '../../../_services/current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isDarkMode: boolean = false;
  store = inject(CurrentUserService);
  private router = inject(Router);
  toastMessage = signal<string | null>(null);
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.isDarkMode = saved ? saved === 'dark' : prefersDark;
    this.applyTheme(this.isDarkMode);
  }

  onToggleTheme(event: Event): void {
    this.isDarkMode = (event.target as HTMLInputElement).checked;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.applyTheme(this.isDarkMode);
    localStorage.setItem('theme', theme);
  }
  private applyTheme(dark: boolean): void {
    this.document.documentElement.setAttribute(
      'data-theme',
      dark ? 'dark' : 'light'
    );
  }

  logout(): void {
    this.store.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastMessage.set('Server unavailable. Please try again later.');
        setTimeout(() => this.toastMessage.set(null), 3000);
      },
    });
  }
}
