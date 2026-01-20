import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showNotification(message: string, type: 'success' | 'error' | 'info'): Observable<Notification> {
    const notification: Notification = {
      id: Date.now(),
      message,
      type
    };

    return of(notification).pipe(delay(2000));
  }
}

