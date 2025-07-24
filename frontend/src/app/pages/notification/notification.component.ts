import { Component, input } from '@angular/core';
import { Notification } from '../../interfaces/todo.interface';
import { NotificationService } from '../../services/notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass],
  templateUrl: './notification.component.html',
   styles: [`
    :host {
      display: block;
      animation: enter 0.3s ease-out;
    }
    
    @keyframes enter {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class NotificationComponent {
  notification = input<Notification>();
  constructor(private readonly notificationService: NotificationService) {}
  dismiss() {
    this.notificationService.dismissNotification(this.notification()!.id);
  }
}
