import { Injectable } from '@angular/core';
import { Observable, interval, take, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  createCountdown(seconds: number): Observable<number> {
    return interval(1000).pipe(
      take(seconds),
      map(n => seconds - n - 1)
    );
  }

  createTimer(): Observable<number> {
    return interval(1000);
  }
}

