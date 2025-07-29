import { Component, signal } from '@angular/core';

import { Navbar } from './pages/layout/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('itransition_task4_client');
}
