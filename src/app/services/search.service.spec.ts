import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService - fakeAsync and tick', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchService]
    });
    service = TestBed.inject(SearchService);
  });

  it('should debounce search input using fakeAsync', fakeAsync(() => {
    const results: string[] = [];

    service.search$.subscribe((term: string) => {
      results.push(term);
    });

    service.onSearch('a');
    service.onSearch('an');
    service.onSearch('ang');

    expect(results.length).toBe(0);

    tick(300);

    expect(results.length).toBe(1);
    expect(results[0]).toBe('ang');
  }));

  it('should emit multiple values if debounce time passes between inputs', fakeAsync(() => {
    const results: string[] = [];

    service.search$.subscribe((term: string) => {
      results.push(term);
    });

    service.onSearch('angular');
    tick(300);

    service.onSearch('rxjs');
    tick(300);

    expect(results).toEqual(['angular', 'rxjs']);
  }));

  it('should filter duplicate consecutive values with distinctUntilChanged', fakeAsync(() => {
    const results: string[] = [];

    service.search$.subscribe((term: string) => {
      results.push(term);
    });

    service.onSearch('test');
    tick(300);

    service.onSearch('test');
    tick(300);

    expect(results).toEqual(['test']);
  }));

  it('should handle rapid input changes correctly', fakeAsync(() => {
    const results: string[] = [];

    service.search$.subscribe((term: string) => {
      results.push(term);
    });

    service.onSearch('a');
    tick(100);
    service.onSearch('an');
    tick(100);
    service.onSearch('ang');
    tick(100);
    service.onSearch('angular');

    expect(results.length).toBe(0);

    tick(300);

    expect(results).toEqual(['angular']);
  }));
});

