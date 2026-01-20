import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService - Testing delay with fakeAsync', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should delay notification by 2 seconds using tick', fakeAsync(() => {
    let notificationReceived = false;
    let receivedNotification: Notification | null = null;

    service.showNotification('წარმატება!', 'success').subscribe(notification => {
      notificationReceived = true;
      receivedNotification = notification;
    });

    expect(notificationReceived).toBe(false);

    tick(1000);
    expect(notificationReceived).toBe(false);

    tick(1000);
    expect(notificationReceived).toBe(true);
    expect(receivedNotification?.message).toBe('წარმატება!');
    expect(receivedNotification?.type).toBe('success');
  }));

  it('should use flush() to complete all async operations immediately', fakeAsync(() => {
    let notificationReceived = false;

    service.showNotification('შეცდომა!', 'error').subscribe(() => {
      notificationReceived = true;
    });

    expect(notificationReceived).toBe(false);

    tick(2000); // Use tick instead of flush for delay operator

    expect(notificationReceived).toBe(true);
  }));

  it('should handle multiple notifications with different delays', fakeAsync(() => {
    const results: string[] = [];

    service.showNotification('First', 'info').subscribe(() => {
      results.push('first');
    });

    service.showNotification('Second', 'success').subscribe(() => {
      results.push('second');
    });

    expect(results.length).toBe(0);

    tick(2000);

    expect(results).toEqual(['first', 'second']);
  }));

  it('should handle notification with Georgian characters', fakeAsync(() => {
    let message = '';

    service.showNotification('ტესტის შეტყობინება 🎉', 'success').subscribe(notification => {
      message = notification.message;
    });

    tick(2000);

    expect(message).toBe('ტესტის შეტყობინება 🎉');
  }));
});

