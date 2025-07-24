import { Injectable, signal } from '@angular/core';
import { Notification } from '../interfaces/todo.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  notifications = this._notifications.asReadonly();

  private generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 5000) {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    this._notifications.update(notifications => [...notifications, notification]);

    // Auto-dismiss if duration is set
    if (duration > 0) {
      setTimeout(() => this.dismissNotification(notification.id), duration);
    }
  }

  dismissNotification(id: string) {
    this._notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  clearAll() {
    this._notifications.set([]);
  }

  // Helper methods for common notification types
  showSuccess(message: string, duration: number = 3000) {
    this.showNotification(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000) {
    this.showNotification(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 3000) {
    this.showNotification(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 4000) {
    this.showNotification(message, 'warning', duration);
  }
}