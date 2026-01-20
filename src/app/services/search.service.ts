import { Injectable } from '@angular/core';
import { Subject, Observable, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new Subject<string>();

  search$: Observable<string> = this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }
}

