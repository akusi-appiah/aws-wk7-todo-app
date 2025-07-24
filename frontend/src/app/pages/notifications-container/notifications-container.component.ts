import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-notifications-container',
  standalone: true,
  imports: [NotificationComponent],
  template: `
    <div class="fixed bottom-4 left-4 z-50 w-full max-w-xs space-y-2">
      @for (notification of notifications(); track notification.id) {
        <app-notification [notification]="notification" />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      pointer-events: none;
    }
    
    app-notification {
      pointer-events: auto;
    }
  `]
})
export class NotificationsContainerComponent {
  private readonly notificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;
}
