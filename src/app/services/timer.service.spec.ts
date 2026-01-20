import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('TimerService - Testing interval with fakeAsync', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService]
    });
    service = TestBed.inject(TimerService);
  });

  it('should countdown from 5 to 0', fakeAsync(() => {
    // English: Test interval-based countdown
    // ქართული: ტესტირება interval-ზე დაფუძნებული უკუ-დათვლის
    const values: number[] = [];

    service.createCountdown(5).subscribe(value => {
      values.push(value);
    });

    // English: Initially no values emitted
    // ქართული: თავდაპირველად არ არის გამოცემული მნიშვნელობები
    expect(values.length).toBe(0);

    // English: After 1 second, first value (4)
    // ქართული: 1 წამის შემდეგ, პირველი მნიშვნელობა (4)
    tick(1000);
    expect(values).toEqual([4]);

    // English: After 2 seconds total, second value (3)
    // ქართული: 2 წამის შემდეგ სულ, მეორე მნიშვნელობა (3)
    tick(1000);
    expect(values).toEqual([4, 3]);

    tick(1000);
    expect(values).toEqual([4, 3, 2]);

    tick(1000);
    expect(values).toEqual([4, 3, 2, 1]);

    tick(1000);
    expect(values).toEqual([4, 3, 2, 1, 0]);

    // English: No more emissions after countdown completes
    // ქართული: აღარ არის გამოცემები უკუ-დათვლის დასრულების შემდეგ
    tick(1000);
    expect(values).toEqual([4, 3, 2, 1, 0]);
  }));

  it('should countdown from 3 to 0', fakeAsync(() => {
    const values: number[] = [];

    service.createCountdown(3).subscribe(value => {
      values.push(value);
    });

    tick(3000);

    expect(values).toEqual([2, 1, 0]);
  }));

  it('should handle interval properly with multiple ticks', fakeAsync(() => {
    const values: number[] = [];
    let completed = false;

    service.createCountdown(3).subscribe({
      next: value => values.push(value),
      complete: () => completed = true
    });

    // English: Check each interval emission
    // ქართული: შევამოწმოთ თითოეული interval-ის გამოცემა
    tick(1000);
    expect(values).toEqual([2]);
    expect(completed).toBe(false);

    tick(1000);
    expect(values).toEqual([2, 1]);
    expect(completed).toBe(false);

    tick(1000);
    expect(values).toEqual([2, 1, 0]);
    expect(completed).toBe(true);
  }));

  it('should test partial countdown', fakeAsync(() => {
    const values: number[] = [];
    const subscription = service.createCountdown(10).subscribe(value => {
      values.push(value);
    });

    // English: Only advance time by 3 seconds
    // ქართული: დროს წინ ვაწევთ მხოლოდ 3 წამით
    tick(3000);
    expect(values).toEqual([9, 8, 7]);

    // English: Unsubscribe to stop the countdown
    // ქართული: გამოწერის გაუქმება უკუ-დათვლის შესაჩერებლად
    subscription.unsubscribe();

    tick(7000);
    // English: No new values after unsubscribe
    // ქართული: ახალი მნიშვნელობები არ არის unsubscribe-ის შემდეგ
    expect(values).toEqual([9, 8, 7]);
  }));
});

