import { Component, signal } from '@angular/core';

import { Navbar } from './pages/layout/navbar/navbar';
import { Login } from './pages/auth/login/login';

@Component({
  selector: 'app-root',
  imports: [Navbar, Login],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('itransition_task4_client');
}
