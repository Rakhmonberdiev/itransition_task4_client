import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isDarkMode: boolean = false;
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
}
