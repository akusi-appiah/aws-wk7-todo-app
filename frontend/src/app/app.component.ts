import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsContainerComponent } from './pages/notifications-container/notifications-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NotificationsContainerComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
