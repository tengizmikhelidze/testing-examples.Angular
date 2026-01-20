
# Angular RxJS Unit Testing:  A Comprehensive Guide with Jest and TestBed
# Angular RxJS იუნით ტესტირება: სრული გზამკვლევი Jest-ისა და TestBed-ის გამოყენებით

## Introduction / შესავალი

**English:**
Testing RxJS observables in Angular applications is crucial for building reliable, maintainable code. This comprehensive guide covers best practices for testing RxJS code using Jest and Angular TestBed, including unit tests and integration tests.  We'll explore how to mock data, handle asynchronous operations, test error scenarios, and avoid common pitfalls.

**ქართული:**
RxJS Observable-ების ტესტირება Angular აპლიკაციებში კრიტიკულად მნიშვნელოვანია საიმედო და მოვლადი კოდის შესაქმნელად. ეს სრული გზამკვლევი მოიცავს საუკეთესო პრაქტიკებს RxJS კოდის ტესტირებისთვის Jest-ისა და Angular TestBed-ის გამოყენებით, მათ შორის იუნით და ინტეგრაციულ ტესტებს.  ჩვენ განვიხილავთ როგორ მოვახდინოთ მონაცემების მოკირება (mocking), ასინქრონული ოპერაციების მართვა, შეცდომების სცენარების ტესტირება და გავერიდოთ ხშირ შეცდომებს.

## Prerequisites / წინაპირობები

**English:**
- Angular 12+ project
- Jest configured for Angular (jest-preset-angular)
- Basic understanding of RxJS operators
- Familiarity with Angular TestBed

**ქართული:**
- Angular 12+ პროექტი
- Jest კონფიგურირებული Angular-ისთვის (jest-preset-angular)
- RxJS ოპერატორების ძირითადი ცოდნა
- Angular TestBed-ის ცოდნა

## Setup / დაყენება

```json
{
  "devDependencies": {
    "@angular/core": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/common/http": "^17.0.0",
    "jest":  "^29.0.0",
    "jest-preset-angular": "^13.0.0",
    "rxjs": "^7.8.0",
    "@types/jest": "^29.0.0"
  }
}
```

---

## Chapter 1: How to Mock Data for RxJS Using Jest
## თავი 1: როგორ მოვახდინოთ მონაცემების მოკირება (Mock) RxJS-ისთვის Jest-ის გამოყენებით

**English:**
Mocking is essential for isolating the code under test.  Jest provides powerful mocking capabilities that work seamlessly with RxJS observables. There are several approaches to mock RxJS data. 

**ქართული:**
მოკირება (Mocking) აუცილებელია სატესტო კოდის იზოლირებისთვის.  Jest უზრუნველყოფს ძლიერ მოკირების შესაძლებლობებს, რომლებიც შესანიშნავად მუშაობენ RxJS Observable-ებთან. არსებობს რამდენიმე მიდგომა RxJS მონაცემების მოკირებისთვის.

### 1.1 Mocking with `of()` / მოკირება `of()`-ის გამოყენებით

**English:**
The simplest way to mock observables is using RxJS `of()` operator, which creates an observable that immediately emits values and completes.

**ქართული:**
Observable-ების მოკირების უმარტივესი გზაა RxJS `of()` ოპერატორის გამოყენება, რომელიც ქმნის Observable-ს, რომელიც დაუყოვნებლივ გამოსცემს მნიშვნელობებს და სრულდება.

```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(user => user. role === 'active'))
    );
  }
}
```

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { UserService, User } from './user. service';
import { of } from 'rxjs';

describe('UserService - Mocking with of()', () => {
  let service: UserService;

  const mockUsers: User[] = [
    { id: 1, name: 'გიორგი გელაშვილი', email: 'giorgi@example.com', role: 'active' },
    { id: 2, name: 'ნინო მამაცაშვილი', email: 'nino@example.com', role: 'active' },
    { id: 3, name: 'David Johnson', email: 'david@example.com', role: 'inactive' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
  });

  it('should mock observable with of() - immediate emission', (done) => {
    // English: Mock the service method to return observable with mock data
    // ქართული: სერვისის მეთოდის მოკირება, რომ დააბრუნოს Observable მოკ მონაცემებით
    
    jest.spyOn(service, 'getUsers').mockReturnValue(of(mockUsers));

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(3);
      expect(users[0].name).toBe('გიორგი გელაშვილი');
      done();
    });
  });

  it('should mock filtered data', (done) => {
    // English: Mock with filtered results
    // ქართული:  მოკირება გაფილტრული შედეგებით
    
    const activeUsers = mockUsers.filter(u => u.role === 'active');
    jest.spyOn(service, 'getActiveUsers').mockReturnValue(of(activeUsers));

    service.getActiveUsers().subscribe(users => {
      expect(users. length).toBe(2);
      expect(users. every(u => u.role === 'active')).toBe(true);
      done();
    });
  });
});
```

### 1.2 Mocking with Jest Mock Functions / მოკირება Jest Mock ფუნქციების გამოყენებით

**English:**
For more control, create complete mock objects with Jest's mocking utilities.  This is useful when testing components that depend on services.

**ქართული:**
უფრო დიდი კონტროლისთვის, შექმენით სრული მოკ ობიექტები Jest-ის მოკირების უტილიტების გამოყენებით. ეს სასარგებლოა კომპონენტების ტესტირებისას, რომლებიც დამოკიდებულია სერვისებზე.

```typescript
// user-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService, User } from './user.service';
import { of } from 'rxjs';

describe('Mocking with Jest Mock Functions', () => {
  let mockUserService: jest.Mocked<UserService>;

  const mockUsers: User[] = [
    { id: 1, name: 'თამარ კვირიკაშვილი', email: 'tamar@example.com', role: 'active' },
    { id: 2, name: 'John Smith', email: 'john@example.com', role: 'active' }
  ];

  beforeEach(() => {
    // English: Create a complete mock service with all methods
    // ქართული: შევქმნათ სრული მოკ სერვისი ყველა მეთოდით
    
    mockUserService = {
      getUsers: jest. fn().mockReturnValue(of(mockUsers)),
      getUserById: jest.fn().mockReturnValue(of(mockUsers[0])),
      getActiveUsers: jest.fn().mockReturnValue(of(mockUsers))
    } as any;
  });

  it('should use mocked service', (done) => {
    mockUserService.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(mockUserService.getUsers).toHaveBeenCalled();
      done();
    });
  });

  it('should mock different return values for different calls', (done) => {
    // English: Mock different responses for consecutive calls
    // ქართული: მოვახდინოთ მოკირება სხვადასხვა პასუხებით თანმიმდევრული გამოძახებებისთვის
    
    mockUserService.getUserById
      .mockReturnValueOnce(of(mockUsers[0]))
      .mockReturnValueOnce(of(mockUsers[1]))
      .mockReturnValueOnce(of(null));

    mockUserService.getUserById(1).subscribe(user => {
      expect(user?. name).toBe('თამარ კვირიკაშვილი');
    });

    mockUserService.getUserById(2).subscribe(user => {
      expect(user?.name).toBe('John Smith');
    });

    mockUserService. getUserById(999).subscribe(user => {
      expect(user).toBeNull();
      done();
    });
  });
});
```

### 1.3 Mocking HTTP Requests / HTTP მოთხოვნების მოკირება

**English:**
When testing services that make HTTP calls, use Angular's `HttpClientTestingModule` to mock HTTP requests and responses.

**ქართული:**
სერვისების ტესტირებისას, რომლებიც HTTP გამოძახებებს ახდენენ, გამოიყენეთ Angular-ის `HttpClientTestingModule` HTTP მოთხოვნებისა და პასუხების მოკირებისთვის.

```typescript
// user.service.http.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user.service';

describe('UserService - HTTP Mocking', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, name: 'ლევან ბერიძე', email: 'levan@example.com', role: 'active' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', role: 'active' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // English:  Verify that no unmatched requests are outstanding
    // ქართული:  დავადასტუროთ, რომ არ არის დარჩენილი მოუსწორებელი მოთხოვნები
    httpMock.verify();
  });

  it('should mock HTTP GET request', (done) => {
    // English: Call the service method
    // ქართული: გამოვიძახოთ სერვისის მეთოდი
    
    service. getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
      done();
    });

    // English: Expect that a single request was made to the URL
    // ქართული:  მოველოდოთ, რომ ერთი მოთხოვნა გაკეთდა URL-ზე
    const req = httpMock.expectOne('https://api.example.com/users');
    
    // English: Verify request method
    // ქართული:  შევამოწმოთ მოთხოვნის მეთოდი
    expect(req.request.method).toBe('GET');
    
    // English: Respond with mock data
    // ქართული: მოვახდინოთ პასუხი მოკ მონაცემებით
    req.flush(mockUsers);
  });

  it('should mock HTTP request with specific ID', (done) => {
    const mockUser:  User = mockUsers[0];

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(user?. name).toBe('ლევან ბერიძე');
      done();
    });

    const req = httpMock.expectOne('https://api.example.com/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
```

---

## Chapter 2: How to Test RxJS Using fakeAsync and tick
## თავი 2: როგორ ვატესტოთ RxJS fakeAsync-ისა და tick-ის გამოყენებით

**English:**
`fakeAsync` and `tick` are Angular testing utilities that allow you to control the passage of time in tests. They are essential for testing time-based RxJS operators like `debounceTime`, `delay`, `throttleTime`, and `interval`.

**ქართული:**
`fakeAsync` და `tick` არის Angular-ის სატესტო უტილიტები, რომლებიც საშუალებას გაძლევთ გააკონტროლოთ დროის გავლა ტესტებში. ისინი აუცილებელია დროზე დაფუძნებული RxJS ოპერატორების ტესტირებისთვის, როგორიცაა `debounceTime`, `delay`, `throttleTime` და `interval`.

### 2.1 When to Use fakeAsync and tick / როდის გამოვიყენოთ fakeAsync და tick

**English:**
✅ **Use `fakeAsync` and `tick` when:**
- Testing operators with time delays (`debounceTime`, `delay`, `throttleTime`, `auditTime`)
- Testing `interval` or `timer` observables
- You need to control time progression in tests
- Testing animations or scheduled tasks

❌ **Don't use `fakeAsync` and `tick` when:**
- Testing simple synchronous observables (`of`, `from`)
- Testing HTTP requests (use `done` callback or `async/await` instead)
- Testing WebSocket connections or real-time streams
- You have asynchronous operations that cannot be controlled (like `setTimeout` in third-party libraries)

**ქართული:**
✅ **გამოიყენეთ `fakeAsync` და `tick` როდესაც:**
- ტესტავთ ოპერატორებს დროის დაგვიანებით (`debounceTime`, `delay`, `throttleTime`, `auditTime`)
- ტესტავთ `interval` ან `timer` Observable-ებს
- გჭირდებათ დროის პროგრესის კონტროლი ტესტებში
- ტესტავთ ანიმაციებს ან დაგეგმილ ამოცანებს

❌ **არ გამოიყენოთ `fakeAsync` და `tick` როდესაც:**
- ტესტავთ მარტივ სინქრონულ Observable-ებს (`of`, `from`)
- ტესტავთ HTTP მოთხოვნებს (გამოიყენეთ `done` callback ან `async/await` ამის ნაცვლად)
- ტესტავთ WebSocket კავშირებს ან რეალურ დროის ნაკადებს
- გაქვთ ასინქრონული ოპერაციები, რომლებიც არ კონტროლდება (როგორიცაა `setTimeout` მესამე მხარის ბიბლიოთეკებში)

### 2.2 Testing debounceTime / debounceTime-ის ტესტირება

```typescript
// search.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new Subject<string>();

  search$: Observable<string> = this. searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  onSearch(term: string): void {
    this.searchSubject. next(term);
  }
}
```

```typescript
// search.service.spec.ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchService } from './search. service';

describe('SearchService - fakeAsync and tick', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:  [SearchService]
    });
    service = TestBed.inject(SearchService);
  });

  it('should debounce search input using fakeAsync', fakeAsync(() => {
    // English: Setup - collect emitted values
    // ქართული: მოწყობა - შევაგროვოთ გამოსცემული მნიშვნელობები
    
    const results: string[] = [];
    service.search$. subscribe(term => results.push(term));

    // English: Emit multiple values quickly
    // ქართული: სწრაფად გამოვსცეთ მრავალი მნიშვნელობა
    
    service.onSearch('a');
    tick(100); // ქართული: გაიარე 100 მილიწამი
    
    service.onSearch('an');
    tick(100);
    
    service.onSearch('ang');
    tick(100);
    
    service.onSearch('angular');
    
    // English: At this point, no values should be emitted yet (< 300ms)
    // ქართული: ამ მომენტში, ჯერ არ უნდა იყოს გამოსული მნიშვნელობები (< 300მწ)
    expect(results.length).toBe(0);
    
    // English: Fast-forward time by 300ms - debounce time
    // ქართული: დრო წინ გადავიტანოთ 300მწ-ით - debounce დრო
    tick(300);
    
    // English: Now the last value should be emitted
    // ქართული: ახლა ბოლო მნიშვნელობა უნდა გამოიცეს
    expect(results.length).toBe(1);
    expect(results[0]).toBe('angular');
  }));

  it('should emit multiple values if debounce time passes', fakeAsync(() => {
    const results: string[] = [];
    service.search$.subscribe(term => results.push(term));

    // English: First search
    // ქართული: პირველი ძიება
    service.onSearch('react');
    tick(300);
    
    expect(results).toEqual(['react']);

    // English: Second search after debounce
    // ქართული: მეორე ძიება debounce-ის შემდეგ
    service.onSearch('vue');
    tick(300);
    
    expect(results).toEqual(['react', 'vue']);

    // English: Third search
    // ქართული: მესამე ძიება
    service.onSearch('svelte');
    tick(300);
    
    expect(results).toEqual(['react', 'vue', 'svelte']);
  }));

  it('should filter duplicate consecutive values', fakeAsync(() => {
    const results: string[] = [];
    service.search$.subscribe(term => results.push(term));

    service.onSearch('angular');
    tick(300);
    
    service.onSearch('angular'); // ქართული: იგივე მნიშვნელობა
    tick(300);
    
    service.onSearch('angular'); // ქართული: იგივე მნიშვნელობა
    tick(300);

    // English: Should only emit once due to distinctUntilChanged
    // ქართული: უნდა გამოიცეს მხოლოდ ერთხელ distinctUntilChanged-ის გამო
    expect(results).toEqual(['angular']);
  }));
});
```

### 2.3 Testing delay Operator / delay ოპერატორის ტესტირება

```typescript
// notification.service.ts
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
    
    // English: Delay notification by 2 seconds
    // ქართული: შეატყობინება 2 წამით გვიანდება
    return of(notification).pipe(delay(2000));
  }
}
```

```typescript
// notification.service.spec. ts
import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService - Testing delay', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should delay notification by 2 seconds', fakeAsync(() => {
    // English: Setup test
    // ქართული: ტესტის მოწყობა
    
    let notificationReceived = false;
    
    service.showNotification('წარმატებულია! ', 'success').subscribe(notification => {
      notificationReceived = true;
      expect(notification.message).toBe('წარმატებულია!');
      expect(notification.type).toBe('success');
    });

    // English: Immediately after subscription, notification should not be received
    // ქართული:  გამოწერის შემდეგ დაუყოვნებლივ, შეტყობინება არ უნდა იყოს მიღებული
    expect(notificationReceived).toBe(false);

    // English: After 1 second, still not received
    // ქართული: 1 წამის შემდეგ, ჯერ არ არის მიღებული
    tick(1000);
    expect(notificationReceived).toBe(false);

    // English: After 2 seconds, notification should be received
    // ქართული: 2 წა��ის შემდეგ, შეტყობინება უნდა იყოს მიღებული
    tick(1000);
    expect(notificationReceived).toBe(true);
  }));

  it('should use flush() to complete all async operations', fakeAsync(() => {
    // English: flush() completes ALL pending async operations at once
    // ქართული: flush() ასრულებს ყველა მოლოდინში მყოფ ასინქრონულ ოპერაციას ერთდროულად
    
    let notificationReceived = false;
    
    service.showNotification('შეცდომა!', 'error').subscribe(() => {
      notificationReceived = true;
    });

    expect(notificationReceived).toBe(false);
    
    // English: Instead of tick(2000), use flush()
    // ქართული:  tick(2000)-ის ნაცვლად, გამოვიყენოთ flush()
    flush();
    
    expect(notificationReceived).toBe(true);
  }));
});
```

### 2.4 Testing interval / interval-ის ტესტირება

```typescript
// timer.service.ts
import { Injectable } from '@angular/core';
import { Observable, interval, take, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  // English: Create a countdown timer
  // ქართული: შევქმნათ უკუთვლის ტაიმერი
  createCountdown(seconds: number): Observable<number> {
    return interval(1000).pipe(
      take(seconds),
      map(tick => seconds - tick - 1)
    );
  }
}
```

```typescript
// timer.service.spec.ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('TimerService - Testing interval', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService]
    });
    service = TestBed.inject(TimerService);
  });

  it('should countdown from 5 to 0', fakeAsync(() => {
    // English:  Collect all emitted values
    // ქართული: შევაგროვოთ ყველა გამოსული მნიშვნელობა
    
    const values: number[] = [];
    
    service.createCountdown(5).subscribe(value => {
      values.push(value);
    });

    // English: No values yet
    // ქართული: ჯერ არ არის ���ნიშვნელობები
    expect(values. length).toBe(0);

    // English: After 1 second -> 4
    // ქართული: 1 წამის შემდეგ -> 4
    tick(1000);
    expect(values).toEqual([4]);

    // English: After 2 seconds -> 4, 3
    // ქართული: 2 წამის შემდეგ -> 4, 3
    tick(1000);
    expect(values).toEqual([4, 3]);

    // English: After 3 seconds -> 4, 3, 2
    // ქართული: 3 წამის შემდეგ -> 4, 3, 2
    tick(1000);
    expect(values).toEqual([4, 3, 2]);

    // English: After 4 seconds -> 4, 3, 2, 1
    // ქართული: 4 წამის შემდეგ -> 4, 3, 2, 1
    tick(1000);
    expect(values).toEqual([4, 3, 2, 1]);

    // English: After 5 seconds -> 4, 3, 2, 1, 0
    // ქართული: 5 წამის შემდეგ -> 4, 3, 2, 1, 0
    tick(1000);
    expect(values).toEqual([4, 3, 2, 1, 0]);
  }));
});
```

### 2.5 Component Integration with fakeAsync / კომპონენტის ინტეგრაცია fakeAsync-თან

```typescript
// search-input.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  template: `
    <div class="search-container">
      <input 
        [formControl]="searchControl" 
        placeholder="ძიება..."
        data-testid="search-input"
      />
      <div class="search-results" data-testid="search-results">
        <div *ngIf="isSearching" data-testid="searching">იტვირთება...</div>
        <div *ngFor="let result of searchResults" class="result-item">
          {{ result }}
        </div>
      </div>
    </div>
  `
})
export class SearchInputComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  searchResults: string[] = [];
  isSearching = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges. pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      if (searchTerm) {
        this.performSearch(searchTerm);
      } else {
        this.searchResults = [];
      }
    });
  }

  private performSearch(term: string): void {
    this.isSearching = true;
    
    // English: Simulate search (in real app, this would be an API call)
    // ქართული:  ძიების სიმულაცია (რეალურ აპში, ეს იქნებოდა API გამოძახება)
    setTimeout(() => {
      this.searchResults = [`Result for "${term}"`];
      this.isSearching = false;
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```typescript
// search-input.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent - fakeAsync Integration', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchInputComponent],
      imports: [ReactiveFormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
  });

  it('should debounce user input', fakeAsync(() => {
    // English: Initialize component
    // ქართული:  ინიციალიზაცია კომპონენტის
    
    fixture.detectChanges();

    const input:  HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="search-input"]');

    // English: Type quickly - multiple keystrokes
    // ქართული: სწრაფად ავკრიფოთ - მრავალი კლავიშის დაჭერა
    
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    tick(100);

    input.value = 'an';
    input.dispatchEvent(new Event('input'));
    tick(100);

    input.value = 'ang';
    input.dispatchEvent(new Event('input'));
    tick(50);

    // English: Search should not have been triggered yet
    // ქართული: ძიება ჯერ არ უნდა გაეშვას
    expect(component.isSearching).toBe(false);

    // English: Wait for debounce time
    // ქართული: დაველოდოთ debounce დროს
    tick(300);
    
    // English: Now search should be triggered
    // ქართული: ახლა ძიება უნდა გაეშვას
    expect(component.isSearching).toBe(true);

    // English: Complete the simulated search
    // ქართული: სიმულირებული ძიების დასრულება
    tick(100);
    fixture.detectChanges();

    expect(component.isSearching).toBe(false);
    expect(component.searchResults. length).toBe(1);
  }));

  it('should not search for duplicate values', fakeAsync(() => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture. nativeElement.querySelector('[data-testid="search-input"]');

    // English: Set same value multiple times
    // ქართული: დავაყენოთ იგივე მნიშვნელობა მრავალჯერ
    
    input.value = 'angular';
    input.dispatchEvent(new Event('input'));
    tick(300);
    tick(100); // ქართული: ძიების დასრულება
    
    const firstSearchCount = component.searchResults.length;
    
    input.value = 'angular';
    input. dispatchEvent(new Event('input'));
    tick(300);
    tick(100);
    
    // English: Should not trigger another search
    // ქართული: არ უნდა გაეშვას კიდევ ერთი ძიება
    expect(component. searchResults.length).toBe(firstSearchCount);
    
    flush();
  }));
});
```

---

## Chapter 3: Test Error Scenarios
## თავი 3: შეცდომების სცენარების ტესტირება

**English:**
Testing error scenarios is crucial to ensure your application handles failures gracefully. RxJS provides operators like `catchError`, `retry`, and `throwError` to handle errors.

**ქართული:**
შეცდომების სცენარების ტესტირება კრიტიკულად მნიშვნელოვანია იმის უზრუნველსაყოფად, რომ თქვენი აპლიკაცია გამართულად ამუშავებს წარუმატებლობებს. RxJS უზრუნველყოფს ოპერატორებს როგორიცაა `catchError`, `retry` და `throwError` შეცდომების დასამუშავებლად. 

### 3.1 Testing catchError / catchError-ის ტესტირება

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getData(): Observable<ApiResponse> {
    return this.http.get<any>(`${this.apiUrl}/data`).pipe(
      catchError((error: HttpErrorResponse) => {
        // English: Return a safe fallback value
        // ქართული:  დავაბრუნოთ უსაფრთხო სათადარიგო მნიშვნელობა
        return of({
          success: false,
          error: 'მონაცემების ჩატვირთვა ვერ მოხერხდა'
        });
      })
    );
  }

  getDataWithError(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/data`).pipe(
      catchError((error:  HttpErrorResponse) => {
        // English: Re-throw error with custom message
        // ქართული: შეცდომის თავიდან გაშვება მორგებული შეტყობინებით
        return throwError(() => new Error(`API Error: ${error.status}`));
      })
    );
  }
}
```

```typescript
// api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService - Error Scenarios', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 404 error with catchError', (done) => {
    // English: Test that catchError returns a fallback value
    // ქართული: ვატესტოთ, რომ catchError აბრუნებს სათადარიგო მნიშვნელობას
    
    service.getData().subscribe(response => {
      expect(response. success).toBe(false);
      expect(response.error).toBe('მონაცემების ჩატვირთვა ვერ მოხერხდა');
      done();
    });

    const req = httpMock.expectOne('https://api.example.com/data');
    
    // English: Simulate 404 error
    // ქართული: 404 შეცდომის სიმულაცია
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 error', (done) => {
    service.getData().subscribe(response => {
      expect(response.success).toBe(false);
      expect(response.error).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne('https://api.example.com/data');
    
    // English:  Simulate server error
    // ქართული: სერვერის შეცდომის სიმულაცია
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network error', (done) => {
    service.getData().subscribe(response => {
      expect(response.success).toBe(false);
      expect(response.error).toBe('მონაცემების ჩატვირთვა ვერ მოხერხდა');
      done();
    });

    const req = httpMock.expectOne('https://api.example.com/data');
    
    // English: Simulate network error
    // ქართული: ქსელის შეცდომის სიმულაცია
    req.error(new ProgressEvent('error'), {
      status: 0,
      statusText: 'Network Error'
    });
  });

  it('should re-throw error with custom message', (done) => {
    // English: Test that error is re-thrown
    // ქართული: ვატესტოთ, რომ შეცდომა თავიდან გაიშვება
    
    service.getDataWithError().subscribe({
      next: () => fail('Should not succeed'),
      error: (error:  Error) => {
        expect(error.message).toContain('API Error');
        done();
      }
    });

    const req = httpMock.expectOne('https://api.example.com/data');
    req.flush('Error', { status: 403, statusText: 'Forbidden' });
  });
});
```

### 3.2 Testing retry Logic / retry ლოგიკის ტესტირება

```typescript
// retry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, catchError, of } from 'rxjs';

@Injectable({
  providedIn:  'root'
})
export class RetryService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  // English: Retry failed requests up to 3 times
  // ქართული: ხელახლა ცადოს წარუმატებელი მოთხოვნები 3-ჯერ
  getDataWithRetry(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`).pipe(
      retry(3),
      catchError(error => {
        return of({ error: 'ყველა მცდელობა ვერ მოხერხდა' });
      })
    );
  }
}
```

```typescript
// retry.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RetryService } from './retry.service';

describe('RetryService - Retry Logic', () => {
  let service: RetryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RetryService]
    });

    service = TestBed.inject(RetryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retry 3 times before failing', (done) => {
    // English: Test that request is retried 3 times
    // ქართული: ვატესტოთ, რომ მოთხოვნა 3-ჯერ მოხდება
    
    service.getDataWithRetry().subscribe(response => {
      expect(response.error).toBe('ყველა მცდელობა ვერ მოხერხდა');
      done();
    });

    // English: Initial request + 3 retries = 4 total requests
    // ქართული: საწყისი მოთხოვნა + 3 გამეორება = სულ 4 მოთხოვნა
    for (let i = 0; i < 4; i++) {
      const req = httpMock.expectOne('https://api.example.com/data');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    }
  });

  it('should succeed on second attempt', (done) => {
    const mockData = { id: 1, name: 'Success' };
    
    service. getDataWithRetry().subscribe(response => {
      expect(response).toEqual(mockData);
      done();
    });

    // English: First attempt fails
    // ქართული: პირველი მცდელობა წარუმატებელია
    const req1 = httpMock.expectOne('https://api.example.com/data');
    req1.flush('Error', { status: 500, statusText: 'Internal Server Error' });

    // English: Second attempt succeeds
    // ქართული: მეორე მცდელობა წარმატებულია
    const req2 = httpMock.expectOne('https://api.example.com/data');
    req2.flush(mockData);
  });
});
```

### 3.3 Testing Component Error Handling / კომპონენტის შეცდომების დამუშავების ტესტირება

```typescript
// user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile-container">
      <div *ngIf="loading" data-testid="loading">იტვირთება...</div>
      <div *ngIf="error" class="error-message" data-testid="error">
        {{ error }}
        <button (click)="retry()" data-testid="retry-button">თავიდან ცდა</button>
      </div>
      <div *ngIf="user && ! loading && !error" data-testid="user-profile">
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </div>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  user:  User | null = null;
  loading = false;
  error:  string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUserById(1).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'მომხმარებლის ჩატვირთვა ვერ მოხერხდა.  გთხოვთ სცადოთ თავიდან. ';
        this.loading = false;
      }
    });
  }

  retry(): void {
    this.loadUser();
  }
}
```

```typescript
// user-profile.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { UserService, User } from './user.service';
import { of, throwError } from 'rxjs';

describe('UserProfileComponent - Error Handling', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockUserService: jest.Mocked<UserService>;

  const mockUser: User = {
    id: 1,
    name: 'ნიკა თევზაძე',
    email: 'nika@example.com',
    role: 'active'
  };

  beforeEach(async () => {
    mockUserService = {
      getUserById:  jest.fn(),
      getUsers: jest.fn(),
      getActiveUsers: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [CommonModule],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should display error message when loading fails', (done) => {
    // English: Mock service to throw error
    // ქართული: სერვისის მოკირება შეცდომის გასაგდებად
    
    mockUserService. getUserById.mockReturnValue(
      throwError(() => new Error('Network Error'))
    );

    fixture.detectChanges(); // ქართული: ngOnInit ეშვება

    setTimeout(() => {
      fixture.detectChanges();

      expect(component.loading).toBe(false);
      expect(component.error).toBeTruthy();
      expect(component.user).toBeNull();

      const errorElement = fixture.nativeElement.querySelector('[data-testid="error"]');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('ჩატვირთვა ვერ მოხერხდა');

      done();
    }, 100);
  });

  it('should show loading state initially', () => {
    mockUserService.getUserById.mockReturnValue(of(mockUser));

    component.ngOnInit();

    // English: During loading, loading should be true
    // ქართული: ჩატვირთვის დროს, loading უნდა იყოს true
    expect(component.loading).toBe(true);
  });

  it('should allow retry after error', (done) => {
    // English: First call fails, second call succeeds
    // ქართული: პირველი გამოძახება წარუმატებელია, მეორე წარმატებული
    
    mockUserService. getUserById
      .mockReturnValueOnce(throwError(() => new Error('Network Error')))
      .mockReturnValueOnce(of(mockUser));

    fixture.detectChanges(); // ქართული: პირველი ჩატვირთვა

    setTimeout(() => {
      fixture.detectChanges();
      
      expect(component.error).toBeTruthy();

      // English: Click retry button
      // ქართული: გავაჭირავთ თავიდან ცდის ღილაკს
      const retryButton = fixture.nativeElement.querySelector('[data-testid="retry-button"]');
      retryButton.click();
      fixture.detectChanges();

      setTimeout(() => {
        fixture.detectChanges();

        expect(component.error).toBeNull();
        expect(component.user).toEqual(mockUser);
        expect(component.loading).toBe(false);

        done();
      }, 100);
    }, 100);
  });

  it('should clear error when retry is initiated', () => {
    mockUserService.getUserById.mockReturnValue(of(mockUser));

    component.error = 'Previous error';
    component.retry();

    // English: Error should be cleared immediately
    // ქართული:  შეცდომა დაუყოვნებლივ უნდა გასუფთავდეს
    expect(component.error).toBeNull();
    expect(component. loading).toBe(true);
  });
});
```

---

## Chapter 4: Best Practices for Testing
## თავი 4: საუკეთესო პრაქტიკები ტესტირებისთვის

**English:**
Following best practices ensures your tests are maintainable, reliable, and provide value.  Here are key principles for testing RxJS code in Angular. 

**ქართული:**
საუკეთესო პრაქტიკების დაცვა უზრუნველყოფს, რომ თქვენი ტესტები იყოს მოვლადი, საიმედო და მნიშვნელოვანი. აქ არის ძირითადი პრინციპები RxJS კოდის ტესტირებისთვის Angular-ში.

### 4.1 Always Clean Up Subscriptions / ყოველთვის გაასუფთავეთ გამოწერები

**English:**
Memory leaks are common when subscriptions are not properly cleaned up. Use `takeUntil` pattern or unsubscribe in `ngOnDestroy`.

**ქართული:**
მეხსიერების ჟონვა ხშირია, როდესაც გამოწერები სწორად არ იწმინდება. გამოიყენეთ `takeUntil` პატერნი ან unsubscribe მეთოდი `ngOnDestroy`-ში.

```typescript
// ✅ GOOD - Using takeUntil / კარგი - takeUntil-ის გამოყენება
@Component({... })
export class GoodComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Handle data
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ GOOD - Using async pipe (auto-unsubscribes)
// კარგი - async pipe-ის გამოყენება (ავტომატურად unsubscribe)
@Component({
  template: `<div>{{ data$ | async }}</div>`
})
export class GoodAsyncComponent {
  data$ = this.dataService.getData();
  constructor(private dataService: DataService) {}
}

// ❌ BAD - No cleanup / ცუდი - გაწმენდის გარეშე
@Component({... })
export class BadComponent implements OnInit {
  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      // ⚠️ This subscription will never be cleaned up
      // ⚠️ ეს გამოწერა არასოდეს გაიწმინდება
    });
  }
}
```

**Testing unsubscribe logic:**

```typescript
it('should unsubscribe on destroy', () => {
  const component = new GoodComponent(mockService);
  component.ngOnInit();
  
  const destroySpy = jest.spyOn(component['destroy$'], 'next');
  const completeSpy = jest.spyOn(component['destroy$'], 'complete');
  
  component.ngOnDestroy();
  
  expect(destroySpy).toHaveBeenCalled();
  expect(completeSpy).toHaveBeenCalled();
});
```

### 4.2 Use done() Callback for Async Tests / გამოიყენეთ done() Callback ასინქრონული ტესტებისთვის

**English:**
When testing observables without `fakeAsync`, always use the `done()` callback to signal test completion.

**ქართული:**
Observable-ების ტესტირებისას `fakeAsync`-ის გარეშე, ყოველთვის გამოიყენეთ `done()` callback ტესტის დასრულების სიგნალიზირებისთვის.

```typescript
// ✅ GOOD - Using done() / კარგი - done()-ის გამოყენება
it('should complete async operation', (done) => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
    done(); // ქართული: ეს აუცილებელია! 
  });
});

// ❌ BAD - Missing done() / ცუდი - done()-ის გარეშე
it('should complete async operation', () => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
    // ⚠️ Test will pass even if subscription never emits
    // ⚠️ ტესტი გაივლის მაშინაც კი, თუ გამოწერა არასოდეს გამოსცემს მნიშვნელობას
  });
});

// ✅ GOOD - Using fakeAsync (no done needed)
// კარგი - fakeAsync-ის გამოყენება (done საჭირო არაა)
it('should complete sync operation', fakeAsync(() => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
  });
  tick();
}));
```

### 4.3 Mock at the Right Level / მოკირება სწორ დონეზე

**English:**
Mock dependencies at the appropriate level - services for unit tests, HTTP for integration tests. 

**ქართული:**
მოახდინეთ დამოკიდებულებების მოკირება შესაბამის დონეზე - სერვისები იუნით ტესტებისთვის, HTTP ინტეგრაციული ტესტებისთვის.

```typescript
// ✅ GOOD - Unit test:  Mock the service
// კარგი - იუნით ტესტი: სერვისის მოკირება
describe('Component Unit Test', () => {
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = {
      getUsers: jest.fn().mockReturnValue(of(mockUsers))
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    });
  });

  it('should use mocked service', () => {
    // Test component logic in isolation
    // ტესტავს კომპონენტის ლოგიკას იზოლაციაში
  });
});

// ✅ GOOD - Integration test: Mock HTTP
// კარგი - ინტეგრაციული ტესტი: HTTP-ის მოკირება
describe('Service Integration Test', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should make HTTP request', () => {
    // Test real service with mocked HTTP
    // ტესტავს რეალურ სერვისს მოკირებული HTTP-თი
  });
});
```

### 4.4 Test Both Success and Error Paths / ტესტავთ წარმატებულ და შეცდომის გზებს

**English:**
Comprehensive tests cover both happy paths and error scenarios. 

**ქართული:**
ყოვლისმომცველი ტესტები მოიცავს როგორც წარმატებულ, ისე შეცდომის სცენარებს.

```typescript
describe('Comprehensive Testing', () => {
  it('should handle success scenario', (done) => {
    mockService.getData. mockReturnValue(of(mockData));
    
    component.loadData();
    
    expect(component.data).toEqual(mockData);
    expect(component.error).toBeNull();
    done();
  });

  it('should handle error scenario', (done) => {
    mockService.getData.mockReturnValue(
      throwError(() => new Error('Failed'))
    );
    
    component.loadData();
    
    expect(component.data).toBeNull();
    expect(component.error).toBeTruthy();
    done();
  });

  it('should handle empty results', (done) => {
    mockService.getData.mockReturnValue(of([]));
    
    component.loadData();
    
    expect(component.data).toEqual([]);
    expect(component.isEmpty).toBe(true);
    done();
  });
});
```

### 4.5 Keep Tests Focused and Simple / შეინარჩუნეთ ტესტები ფოკუსირებული და მარტივი

**English:**
Each test should verify one specific behavior.  Avoid testing multiple things in one test.

**ქართული:**
თითოეული ტესტი უნდა ამოწმებდეს ერთ კონკრეტულ ქცევას. თავიდან აიცილეთ რამდენიმე რამის ტესტირება ერთ ტესტში.

```typescript
// ✅ GOOD - Focused tests / კარგი - ფოკუსირებული ტესტები
it('should load users on init', () => {
  // Tests only initialization
  // ტესტავს მხოლოდ ინიციალიზაციას
  expect(component.users).toBeDefined();
});

it('should display loading state', () => {
  // Tests only loading state
  // ტესტავს მხოლოდ ჩატვირთვის მდგომარეობას
  expect(component.loading).toBe(true);
});

it('should handle errors', () => {
  // Tests only error handling
  // ტესტავს მხოლოდ შეცდომების დამუშავებას
  expect(component. error).toBeTruthy();
});

// ❌ BAD - Testing too much / ცუდი - ძალიან ბევრის ტესტირება
it('should do everything', () => {
  // ⚠️ Testing initialization, loading, error, success all at once
  // ⚠️ ტესტავს ინიციალიზაციას, ჩატვირთვას, შეცდომას, წარმატებას ერთდროულად
  expect(component.users).toBeDefined();
  expect(component.loading).toBe(false);
  expect(component.error).toBeNull();
  expect(component.data).toEqual(mockData);
});
```

### 4.6 Use Descriptive Test Names / გამოიყენეთ აღწერითი ტესტის სახელები

**English:**
Test names should clearly describe what is being tested and the expected behavior.

**ქართული:**
ტესტის სახელები უნდა აღწერდეს რას ტესტავთ და მოსალოდნელ ქცევას.

```typescript
// ✅ GOOD - Descriptive names / კარგი - აღწერითი სახელები
describe('UserService', () => {
  it('should return list of users when API call succeeds', (done) => { });
  it('should return empty array when no users exist', (done) => { });
  it('should return null when user is not found', (done) => { });
  it('should retry 3 times before throwing error', (done) => { });
  it('should debounce search input by 300ms', fakeAsync(() => { }));
});

// ❌ BAD - Vague names / ცუდი - ბუნდოვანი სახელები
describe('UserService', () => {
  it('should work', (done) => { }); // ⚠️ What should work?
  it('test 1', (done) => { }); // ⚠️ What does test 1 do?
  it('users', (done) => { }); // ⚠️ What about users?
});
```

### 4.7 Always Call httpMock.verify() / ყოველთვის გამოიძახეთ httpMock.verify()

**English:**
When using `HttpClientTestingModule`, always verify that no unexpected HTTP requests were made.

**ქართული:**
`HttpClientTestingModule`-ის გამოყენებისას, ყოველთვის დაადასტურეთ, რომ არ გაკეთებულა მოულოდნელი HTTP მოთხოვნები.

```typescript
// ✅ GOOD - Always verify / კარგი - ყოველთვის დაადასტურეთ
describe('Service HTTP Tests', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // English: This ensures no unexpected requests were made
    // ქართული: ეს უზრუნველყოფს, რომ მოულოდნელი მოთხოვნები არ გაკეთებულა
    httpMock.verify();
  });

  it('should make HTTP request', (done) => {
    service.getData().subscribe();
    const req = httpMock.expectOne('/api/data');
    req.flush(mockData);
    done();
  });
});
```

### 4.8 Use TestBed for Component Tests / გამოიყენეთ TestBed კომპონენტის ტესტებისთვის

**English:**
Always use TestBed to configure and create components for proper dependency injection and Angular lifecycle management.

**ქართული:**
ყოველთვის გამოიყენეთ TestBed კომპონენტების კონფიგურაციისა და შექმნისთვის სწორი dependency injection-ისა და Angular-ის ცხოვრების ციკლის მართვისთვის. 

```typescript
// ✅ GOOD - Using TestBed / კარგი - TestBed-ის გამოყენება
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed. configureTestingModule({
      declarations: [MyComponent],
      imports: [CommonModule, ReactiveFormsModule],
      providers: [
        { provide: MyService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// ❌ BAD - Manual instantiation / ცუდი - ხელით შექმნა
describe('MyComponent', () => {
  it('should create', () => {
    // ⚠️ No dependency injection, no lifecycle hooks
    // ⚠️ არ არის dependency injection, არ არის lifecycle hooks
    const component = new MyComponent(mockService);
    expect(component).toBeTruthy();
  });
});
```

---

## Chapter 5: Integration Test Examples for RxJS
## თავი 5: ინტეგრაციული ტესტების მაგალითები RxJS-ისთვის

**English:**
Integration tests verify that multiple components work together correctly. These tests are more complex than unit tests but provide greater confidence in your application. 

**ქართული:**
ინტეგრაციული ტესტები ამოწმებენ, რომ რამდენიმე კომპონენტი სწორად მუშაობს ერთად. ეს ტესტები უფრო რთულია ვიდრე იუნით ტესტები, მაგრამ უზრუნველყოფენ უფრო დიდ ნდობას თქვენს აპლიკაციაში. 

### 5.1 Component + Service Integration / კომპონენტი + სერვისი ინტეგრაცია

```typescript
// product-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.example.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this. http.get<Product[]>(this.apiUrl);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }
}

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-container">
      <h2>პროდუქტები</h2>
      
      <div class="filters">
        <button 
          *ngFor="let cat of categories" 
          (click)="filterByCategory(cat)"
          [attr.data-testid]="'category-' + cat">
          {{ cat }}
        </button>
      </div>

      <div *ngIf="loading" data-testid="loading">იტვირთება...</div>
      <div *ngIf="error" class="error" data-testid="error">{{ error }}</div>

      <div class="product-list" *ngIf="! loading && !error">
        <div 
          *ngFor="let product of products" 
          class="product-card"
          [attr.data-testid]="'product-' + product.id">
          <h3>{{ product.name }}</h3>
          <p>₾{{ product.price }}</p>
          <span class="category">{{ product.category }}</span>
        </div>
      </div>

      <div *ngIf="! loading && products. length === 0" data-testid="no-products">
        პროდუქტები არ მოიძებნა
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories = ['ყველა', 'ელექტრონიკა', 'წიგნები', 'ტანსაცმელი'];
  loading = false;
  error:  string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(category?: string): void {
    this.loading = true;
    this.error = null;

    const request$ = category && category !== 'ყველა'
      ? this.productService.getProductsByCategory(category)
      : this.productService. getProducts();

    request$.pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        this.error = 'პროდუქტების ჩატვირთვა ვერ მოხერხდა';
        this.products = [];
      }
    });
  }

  filterByCategory(category: string): void {
    this.loadProducts(category === 'ყველა' ?  undefined : category);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```typescript
// product-list.component.integration.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ProductListComponent, ProductService, Product } from './product-list. component';

describe('ProductListComponent - Integration Tests', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    { id: 1, name: 'ლეპტოპი', price: 2500, category: 'ელექტრონიკა' },
    { id: 2, name: 'წიგნი', price: 25, category: 'წიგნები' },
    { id: 3, name: 'მაისური', price: 45, category: 'ტანსაცმელი' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [CommonModule, HttpClientTestingModule],
      providers: [ProductService]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load and display products on init', (done) => {
    // English: Trigger component initialization
    // ქართული: კომპონენტის ინიციალიზაციის გაშვება
    fixture.detectChanges();

    // English:  Verify loading state is shown
    // ქართული:  შევამოწმოთ, რომ ჩატვირთვის მდგომარეობა ნაჩვენებია
    expect(component.loading).toBe(true);
    const loadingElement = fixture.nativeElement.querySelector('[data-testid="loading"]');
    expect(loadingElement).toBeTruthy();

    // English: Handle HTTP request
    // ქართული:  HTTP მოთხოვნის დამუშავება
    const req = httpMock.expectOne('https://api.example.com/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);

    // English: Wait for async operations to complete
    // ქართული: დაველოდოთ ასინქრონული ოპერაციების დასრულებას
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.loading).toBe(false);
      expect(component. products).toEqual(mockProducts);

      // English: Verify products are displayed in the DOM
      // ქართული: შევამოწმოთ, რომ პროდუქტები ნაჩვენებია DOM-ში
      const productElements = fixture.nativeElement.querySelectorAll('. product-card');
      expect(productElements.length).toBe(3);
      expect(productElements[0]. textContent).toContain('ლეპტოპი');
      expect(productElements[0].textContent).toContain('₾2500');

      done();
    });
  });

  it('should filter products by category', (done) => {
    fixture.detectChanges();

    // English: Initial load
    // ქართული:  საწყისი ჩატვირთვა
    const req1 = httpMock.expectOne('https://api.example.com/products');
    req1.flush(mockProducts);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // English: Click on electronics category button
      // ქართული:  ელექტრონიკის კატეგორიის ღილაკზე დაჭერა
      const electronicsButton = fixture.nativeElement.querySelector('[data-testid="category-ელექტრონიკა"]');
      electronicsButton.click();
      fixture.detectChanges();

      // English: Verify filtered request
      // ქართული: გაფილტრული მოთხოვნის შემოწმება
      const req2 = httpMock.expectOne('https://api.example.com/products?category=ელექტრონიკა');
      expect(req2.request.method).toBe('GET');

      const filteredProducts = mockProducts.filter(p => p. category === 'ელექტრონიკა');
      req2.flush(filteredProducts);

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(component.products. length).toBe(1);
        expect(component.products[0].category).toBe('ელექტრონიკა');

        const productElements = fixture.nativeElement.querySelectorAll('.product-card');
        expect(productElements.length).toBe(1);

        done();
      });
    });
  });

  it('should handle empty results gracefully', (done) => {
    fixture.detectChanges();

    const req = httpMock.expectOne('https://api.example.com/products');
    req.flush([]);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.products.length).toBe(0);

      const noProductsElement = fixture.nativeElement. querySelector('[data-testid="no-products"]');
      expect(noProductsElement).toBeTruthy();
      expect(noProductsElement.textContent).toContain('პროდუქტები არ მოიძებნა');

      done();
    });
  });

  it('should handle errors and allow retry', (done) => {
    fixture.detectChanges();

    // English: First request fails
    // ქართული: პირველი მოთხოვნა წარუმატებელია
    const req1 = httpMock.expectOne('https://api.example.com/products');
    req1.error(new ProgressEvent('error'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.error).toBeTruthy();
      expect(component.products.length).toBe(0);

      const errorElement = fixture.nativeElement.querySelector('[data-testid="error"]');
      expect(errorElement).toBeTruthy();

      // English:  Retry by clicking category
      // ქართული: თავიდან ცდა კატეგორიის დაჭერით
      const allButton = fixture.nativeElement.querySelector('[data-testid="category-ყველა"]');
      allButton.click();
      fixture.detectChanges();

      // English: Second request succeeds
      // ქართული: მეორე მოთხოვნა წარმატებულია
      const req2 = httpMock.expectOne('https://api.example.com/products');
      req2.flush(mockProducts);

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(component. error).toBeNull();
        expect(component.products).toEqual(mockProducts);

        done();
      });
    });
  });
});
```

### 5.2 Multiple Services Integration / მრავალი სერვისის ინტეგრაცია

```typescript
// order. service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

export interface Order {
  id: number;
  userId: number;
  productIds: number[];
  total: number;
  status: string;
}

export interface OrderDetails extends Order {
  user: User;
  products: Product[];
}

@Injectable({
  providedIn:  'root'
})
export class OrderService {
  private apiUrl = 'https://api.example.com';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private productService: ProductService
  ) {}

  getOrderWithDetails(orderId: number): Observable<OrderDetails> {
    // English: First get the order
    // ქართული:  ჯერ მივიღოთ შეკვეთა
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`).pipe(
      switchMap(order => {
        // English: Then get user and all products
        // ქართული: შემდეგ მივიღოთ მომხმარებელი და ყველა პროდუქტი
        return forkJoin({
          order: [order],
          user: this.userService.getUserById(order.userId),
          products: forkJoin(
            order. productIds.map(id => this.productService.getProductById(id))
          )
        });
      }),
      map(({ order, user, products }) => ({
        ...order[0],
        user,
        products
      }))
    );
  }
}
```

```typescript
// order.service.integration.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService, Order, OrderDetails } from './order.service';
import { UserService } from './user.service';
import { ProductService } from './product.service';

describe('OrderService - Multiple Services Integration', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockOrder: Order = {
    id:  1,
    userId: 100,
    productIds: [1, 2],
    total: 2570,
    status: 'pending'
  };

  const mockUser = {
    id: 100,
    name: 'გიორგი მამარდაშვილი',
    email:  'giorgi@example.com',
    role: 'active'
  };

  const mockProduct1 = { id: 1, name: 'ლეპტოპი', price: 2500, category: 'ელექტრონიკა' };
  const mockProduct2 = { id: 2, name: 'თაგვი', price: 70, category: 'ელექტრონიკა' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService, UserService, ProductService]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get order with user and product details', (done) => {
    // English: Make the service call
    // ქართული: სერვისის გამოძახება
    service.getOrderWithDetails(1).subscribe(orderDetails => {
      // English:  Verify the combined result
      // ქართული: შევამოწმოთ გაერთიანებული შედეგი
      expect(orderDetails.id).toBe(1);
      expect(orderDetails.user.name).toBe('გიორგი მამარდაშვილი');
      expect(orderDetails.products.length).toBe(2);
      expect(orderDetails.products[0].name).toBe('ლეპტოპი');
      expect(orderDetails.products[1].name).toBe('თაგვი');
      expect(orderDetails.total).toBe(2570);

      done();
    });

    // English: Handle order request
    // ქართული: შეკვეთის მოთხოვნის დამუშავება
    const orderReq = httpMock.expectOne('https://api.example.com/orders/1');
    expect(orderReq.request.method).toBe('GET');
    orderReq.flush(mockOrder);

    // English: Handle user request
    // ქ���რთული: მომხმარებლის მოთხოვნის დამუშავება
    const userReq = httpMock.expectOne('https://api.example.com/users/100');
    expect(userReq.request.method).toBe('GET');
    userReq.flush(mockUser);

    // English: Handle product requests
    // ქართული:  პროდუქტების მოთხოვნების დამუშავება
    const product1Req = httpMock.expectOne('https://api.example.com/products/1');
    product1Req.flush(mockProduct1);

    const product2Req = httpMock.expectOne('https://api.example.com/products/2');
    product2Req.flush(mockProduct2);
  });

  it('should handle error in user request', (done) => {
    service.getOrderWithDetails(1).subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      }
    });

    const orderReq = httpMock.expectOne('https://api.example.com/orders/1');
    orderReq.flush(mockOrder);

    // English: User request fails
    // ქართული: მომხმარებლის მოთხოვნა წარუმატებელია
    const userReq = httpMock.expectOne('https://api.example.com/users/100');
    userReq.error(new ProgressEvent('error'));
  });
});
```

### 5.3 Real-Time Data Integration / რეალურ დროის მონაცემების ინტეგრაცია

```typescript
// notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, scan } from 'rxjs';

export interface Notification {
  id:  number;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationStreamService {
  private notificationSubject = new Subject<Notification>();
  
  notifications$ = this.notificationSubject.asObservable().pipe(
    scan((acc, notification) => [notification, ...acc]. slice(0, 5), [] as Notification[])
  );

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    this.notificationSubject.next({
      ...notification,
      id: Date.now(),
      timestamp: new Date()
    });
  }
}

@Component({
  selector: 'app-notification-center',
  template: `
    <div class="notification-center" data-testid="notification-center">
      <h3>შეტყობინებები</h3>
      <div 
        *ngFor="let notification of notifications" 
        [class]="'notification ' + notification.type"
        [attr.data-testid]="'notification-' + notification.id">
        <span class="message">{{ notification.message }}</span>
        <span class="time">{{ notification.timestamp | date:'short' }}</span>
      </div>
      <div *ngIf="notifications.length === 0" data-testid="no-notifications">
        შეტყობინებები არ არის
      </div>
    </div>
  `
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationStream: NotificationStreamService) {}

  ngOnInit(): void {
    this.notificationStream.notifications$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```typescript
// notification.component.integration.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NotificationCenterComponent, NotificationStreamService, Notification } from './notification.component';

describe('NotificationCenterComponent - Real-Time Integration', () => {
  let component: NotificationCenterComponent;
  let fixture: ComponentFixture<NotificationCenterComponent>;
  let notificationService: NotificationStreamService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationCenterComponent],
      imports: [CommonModule],
      providers: [NotificationStreamService]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCenterComponent);
    component = fixture. componentInstance;
    notificationService = TestBed.inject(NotificationStreamService);
  });

  it('should display new notifications as they arrive', fakeAsync(() => {
    fixture.detectChanges();

    // English: Initially no notifications
    // ქართული: თავდაპირველად არ არის შეტყობინებები
    expect(component.notifications.length).toBe(0);
    const noNotifications = fixture.nativeElement.querySelector('[data-testid="no-notifications"]');
    expect(noNotifications).toBeTruthy();

    // English: Add first notification
    // ქართული: დავამატოთ პირველი შეტყობინება
    notificationService.addNotification({
      message: 'წარმატებით შენახულია',
      type: 'success'
    });

    tick();
    fixture.detectChanges();

    expect(component.notifications.length).toBe(1);
    let notificationElements = fixture.nativeElement.querySelectorAll('. notification');
    expect(notificationElements.length).toBe(1);
    expect(notificationElements[0].textContent).toContain('წარმატებით შენახულია');

    // English: Add second notification
    // ქართული: დავამატოთ მეორე შეტყობინება
    notificationService.addNotification({
      message: 'შეცდომა მოხდა',
      type: 'error'
    });

    tick();
    fixture.detectChanges();

    expect(component.notifications.length).toBe(2);
    notificationElements = fixture. nativeElement.querySelectorAll('.notification');
    expect(notificationElements.length).toBe(2);

    // English:  Newest should be first
    // ქართული: უახლესი უნდა იყოს პირველი
    expect(notificationElements[0].textContent).toContain('შეცდომა მოხდა');
    expect(notificationElements[1].textContent).toContain('წარმატებით შენახულია');
  }));

  it('should keep only last 5 notifications', fakeAsync(() => {
    fixture.detectChanges();

    // English: Add 7 notifications
    // ქართული: დავამატოთ 7 შეტყობინება
    for (let i = 1; i <= 7; i++) {
      notificationService.addNotification({
        message: `შეტყობინება ${i}`,
        type: 'info'
      });
      tick();
    }

    fixture.detectChanges();

    // English: Should only have 5
    // ქართული: უნდა იყოს მხოლოდ 5
    expect(component.notifications.length).toBe(5);
    
    // English: Should have the latest 5 (3-7)
    // ქართული: უნდა იყოს უახლესი 5 (3-7)
    expect(component.notifications[0].message).toBe('შეტყობინება 7');
    expect(component.notifications[4].message).toBe('შეტყობინება 3');
  }));
});
```

---

## Chapter 6: Common Pitfalls to Avoid
## თავი 6: ხშირი შეცდომები, რომლებიც უნდა თავიდან ავიცილოთ

**English:**
Understanding common mistakes helps you write better tests and avoid frustrating debugging sessions.

**ქართული:**
ხშირი შეცდომების გაგება დაგეხმარებათ დაწეროთ უკეთესი ტესტები და თავი აარიდოთ დამღლელ დებაგინგ სესიებს.

### 6.1 Forgetting to Call done() / done()-ის გამოძახების დავიწყება

**English:**
❌ **Problem:** Async tests complete before the observable emits, causing false positives. 

**ქართული:**
❌ **პრობლემა:** ასინქრონული ტესტები სრულდება Observable-ის გამოშვებამდე, რაც იწვევს ცრუ პოზიტიურ შედეგებს.

```typescript
// ❌ BAD - Test passes even if observable never emits
// ცუდი - ტესტი გაივლის მაშინაც კი, თუ Observable არასოდ��ს გამოსცემს
it('will give false positive', () => {
  service.getData().subscribe(data => {
    expect(data).toBe('expected'); // ⚠️ This might never run
  });
  // Test completes immediately / ტესტი დაუყოვნებლივ სრულდება
});

// ✅ GOOD - Test waits for subscription
// კარგი - ტესტი ელოდება გამოწერას
it('will wait correctly', (done) => {
  service.getData().subscribe(data => {
    expect(data).toBe('expected');
    done(); // ✓ Now test waits
  });
});
```

### 6.2 Not Calling httpMock.verify() / httpMock.verify()-ის გამოუძახებლობა

**English:**
❌ **Problem:** Tests pass even when unexpected HTTP requests are made or expected requests are missing.

**ქართული:**
❌ **პრობლემა:** ტესტები გაივლის მაშინაც კი, როდესაც გაკეთებულია მოულოდნელი HTTP მოთხოვნები ან მოსალოდნელი მოთხოვნები აკლია.

```typescript
// ❌ BAD - No verification
// ცუდი - ვერიფიკაციის გარეშე
describe('Bad Practice', () => {
  // Missing afterEach with httpMock.verify()
  // აკლია afterEach httpMock.verify()-ით
  
  it('test', (done) => {
    service.getData().subscribe();
    // ⚠️ If we forget to handle the request, test still passes
    // ⚠️ თუ დაგვავიწყდა მოთხოვნის დამუშავება, ტესტი მაინც გაივლის
    done();
  });
});

// ✅ GOOD - Always verify
// კარგი - ყოველთვის ვერიფიკაცია
describe('Good Practice', () => {
  afterEach(() => {
    httpMock.verify(); // ✓ Catches unhandled requests
  });
  
  it('test', (done) => {
    service.getData().subscribe();
    const req = httpMock.expectOne('/api/data');
    req.flush(mockData);
    done();
  });
});
```

### 6.3 Memory Leaks from Unsubscribed Observables / მეხსიერების ჟონვა დაუსუბსქრაიბებელი Observable-ებისგან

**English:**
❌ **Problem:** Subscriptions that are never cleaned up cause memory leaks and can affect other tests.

**ქართული:**
❌ **პრობლემა:** გამოწერები, რომლებიც არასოდეს იწმინდება, იწვევენ მეხსიერების ჟონვას და შეუძლიათ იმოქმედონ სხვა ტესტებზე.

```typescript
// ❌ BAD - Subscription leak
// ცუდი - გამოწერის ჟონვა
@Component({... })
export class LeakyComponent implements OnInit {
  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      // ⚠️ This subscription never ends! 
      // ⚠️ ეს გამოწერა არასოდეს მთავრდება! 
    });
    
    interval(1000).subscribe(() => {
      // ⚠️ Interval runs forever!
      // ⚠️ Interval მუდამ მუშაობს! 
    });
  }
}

// ✅ GOOD - Proper cleanup
// კარგი - სწორი გაწმენდა
@Component({...})
export class CleanComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // ✓ Will unsubscribe on destroy
    });
    
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // ✓ Will stop on destroy
    });
  }
  
  ngOnDestroy() {
    this.destroy$. next();
    this.destroy$. complete();
  }
}
```

### 6.4 Using fakeAsync with Real HTTP / fakeAsync-ის გამოყენება რეალურ HTTP-სთან

**English:**
❌ **Problem:** `fakeAsync` doesn't work with real asynchronous operations like HTTP requests.

**ქართული:**
❌ **პრობლემა:** `fakeAsync` არ მუშაობს რეალურ ასინქრონულ ოპერაციებთან როგორიცაა HTTP მოთხოვნები.

```typescript
// ❌ BAD - fakeAsync with HTTP
// ცუდი - fakeAsync HTTP-სთან
it('will fail', fakeAsync(() => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
  });
  
  const req = httpMock.expectOne('/api/data');
  req.flush(mockData);
  
  tick(); // ⚠️ Error: Cannot use fakeAsync with real HTTP
}));

// ✅ GOOD - Use done() callback with HTTP
// კარგი - გამოიყენეთ done() callback HTTP-სთან
it('will work', (done) => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
    done();
  });
  
  const req = httpMock.expectOne('/api/data');
  req.flush(mockData);
});

// ✅ GOOD - Use fakeAsync for time-based operators only
// კარგი - გამოიყენეთ fakeAsync მხოლოდ დროზე დაფუძნებული ოპერატორებისთვის
it('debounce works', fakeAsync(() => {
  const results:  string[] = [];
  searchService.search$. subscribe(term => results.push(term));
  
  searchService.onSearch('test');
  tick(300);
  
  expect(results).toEqual(['test']);
}));
```

### 6.5 Not Detecting Changes After Async Operations / ცვლილებების დაუდგენლობა ასინქრონული ოპერაციების შემდეგ

**English:**
❌ **Problem:** Component view doesn't update because `fixture.detectChanges()` wasn't called.

**ქართული:**
❌ **პრობლემა:** კომპონენტის ხედი არ განახლდება, რადგან `fixture.detectChanges()` არ გამოიძახა.

```typescript
// ❌ BAD - Missing detectChanges
// ცუდი - detectChanges აკლია
it('will not see updates', (done) => {
  mockService.getData. mockReturnValue(of(mockData));
  
  fixture.detectChanges(); // ngOnInit runs
  
  const req = httpMock.expectOne('/api/data');
  req.flush(mockData);
  
  // ⚠️ DOM not updated yet! 
  // ⚠️ DOM ჯერ არ განახლებულა!
  const element = fixture.nativeElement. querySelector('.data');
  expect(element.textContent).toContain('mockData'); // ❌ Fails
  
  done();
});

// ✅ GOOD - Call detectChanges after async operations
// კარგი - გამოიძახეთ detectChanges ასინქრონული ოპერაციების შემდეგ
it('will see updates', (done) => {
  mockService.getData. mockReturnValue(of(mockData));
  
  fixture.detectChanges(); // ngOnInit runs
  
  const req = httpMock.expectOne('/api/data');
  req.flush(mockData);
  
  fixture.whenStable().then(() => {
    fixture.detectChanges(); // ✓ Update DOM
    
    const element = fixture.nativeElement.querySelector('.data');
    expect(element.textContent).toContain('mockData'); // ✓ Passes
    
    done();
  });
});
```

### 6.6 Testing Implementation Instead of Behavior / იმპლემენტაციის ტესტირება ქცევის ნაცვლად

**English:**
❌ **Problem:** Tests break when refactoring even though behavior hasn't changed.

**ქართული:**
❌ **პრობლემა:** ტესტები იშლება რეფაქტორინგისას, მიუხედავად იმისა, რომ ქცევა არ შეცვლილა.

```typescript
// ❌ BAD - Testing implementation details
// ცუდი - იმპლემენტაციის დეტალების ტესტირება
it('bad test', () => {
  const spy = jest.spyOn(component as any, 'privateMethod');
  
  component.publicMethod();
  
  // ⚠️ Testing private implementation
  // ⚠️ პრივატული იმპლემენტაციის ტესტირება
  expect(spy).toHaveBeenCalled();
  expect(component.internalState).toBe('something');
});

// ✅ GOOD - Testing public behavior
// კარგი - საჯარო ქცევის ტესტირება
it('good test', () => {
  component.publicMethod();
  
  // ✓ Testing observable output
  // ✓ Observable-ის გამოსვლის ტესტირება
  expect(component.result).toBe('expected');
  
  // ✓ Testing DOM output
  // ✓ DOM-ის გამოსვლის ტესტირება
  const element = fixture.nativeElement. querySelector('.result');
  expect(element.textContent).toBe('expected');
});
```

### 6.7 Hardcoding Values Instead of Using Mocks / მნიშვნელობების ჰარდკოდირება მოკების ნაცვლად

**English:**
❌ **Problem:** Tests become brittle and don't represent realistic data. 

**ქართული:**
❌ **პრობლემა:** ტესტები ხდება მყიფე და არ წარმოადგენს რეალისტურ მონაცემებს. 

```typescript
// ❌ BAD - Hardcoded values scattered everywhere
// ცუდი - ჰარდკოდირებული მნიშვნელობები ყველგან გაბნეული
it('bad test 1', () => {
  const user = { id: 1, name: 'Test', email: 'test@test.com' };
  // ... 
});

it('bad test 2', () => {
  const user = { id: 1, name: 'Test', email: 'test@test.com' }; // ⚠️ Duplicated
  // ...
});

// ✅ GOOD - Centralized mock data
// კარგი - ცენტრალიზებული მოკ მონაცემები
describe('UserComponent', () => {
  const mockUser = {
    id:  1,
    name: 'ლევან ხუციშვილი',
    email:  'levan@example.com',
    role: 'active'
  };
  
  const mockUsers = [mockUser, { ... mockUser, id: 2, name: 'მარი��მ' }];
  
  it('good test 1', () => {
    // ✓ Reuse consistent mock data
    expect(component.user).toEqual(mockUser);
  });
  
  it('good test 2', () => {
    // ✓ Same data, consistent results
    expect(component.users).toEqual(mockUsers);
  });
});
```

---

## Chapter 7: Conclusion
## თავი 7: დასკვნა

**English:**
Testing RxJS code in Angular applications requires understanding both the Angular testing framework and RxJS patterns. By following the best practices outlined in this guide, you can write comprehensive, maintainable tests that give you confidence in your code. 

**Key Takeaways:**

1. **Mock Data Properly** - Use Jest's mocking capabilities with RxJS `of()`, `throwError()`, and `HttpClientTestingModule`
2. **Control Time** - Use `fakeAsync` and `tick` for time-based operators, but avoid them with real HTTP requests
3. **Test Errors** - Always test both success and error scenarios using `catchError`, `retry`, and error mocking
4. **Follow Best Practices** - Clean up subscriptions, use `done()` callbacks, call `httpMock.verify()`, and test behavior not implementation
5. **Integration Tests** - Test how multiple components work together to catch integration issues
6. **Avoid Pitfalls** - Watch out for common mistakes like memory leaks, missing `detectChanges()`, and testing implementation details

**Next Steps:**

- Practice writing tests for your existing RxJS code
- Refactor tests to follow the patterns in this guide
- Set up continuous integration to run tests automatically
- Aim for high test coverage (80%+) while focusing on critical paths
- Share knowledge with your team and establish testing standards

**Resources:**

- [Angular Testing Documentation](https://angular.io/guide/testing)
- [RxJS Official Documentation](https://rxjs.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://angular.io/guide/testing-best-practices)

---

**ქართული:**
RxJS კოდის ტესტირება Angular აპლიკაციებში მოითხოვს როგორც Angular-ის სატესტო ფრეიმვორკის, ისე RxJS პატერნების გაგებას. ამ გზამკვლევში მოცემული საუკეთესო პრაქტიკების დაცვით, შეგიძლიათ დაწეროთ ყოვლისმომცველი, მოვლადი ტესტები, რომლებიც მოგცემენ ნდობას თქვენს კოდში.

**მთავ��რი მოსაზრებები:**

1. **სწორად მოახდინეთ მონაცემების მოკირება** - გამო���ყენეთ Jest-ის მოკირების შესაძლებლობები RxJS `of()`, `throwError()` და `HttpClientTestingModule`-თან ერთად
2. **აკონტროლეთ დრო** - გამოიყენეთ `fakeAsync` და `tick` დროზე დაფუძნებული ოპერატორებისთვის, მაგრამ თავიდან აიცილეთ მათი გამოყენება რეალურ HTTP მოთხოვნებთან
3. **ატესტეთ შეცდომები** - ყოველთვის ატესტეთ როგორც წარმატებული, ისე შეცდომის სცე��არები `catchError`, `retry` და შეცდომების მოკირების გამოყენებით
4. **დაიცავით საუკეთესო პრაქტიკები** - გაასუფთავეთ გამოწერები, გამოიყენეთ `done()` callback-ები, გამოიძახეთ `httpMock.verify()` და ატესტეთ ქცევა, არა იმპლემენტაცია
5. **ინტეგრაციული ტესტები** - ატესტეთ როგორ მუშაობს რამდენიმე კომპონენტი ერთად ინტეგრაციული პრობლემების დასაფიქსირებლად
6. **თავიდან აიცილეთ შეცდომები** - ყურადღება მიაქციეთ ხშირ შეცდომებს, როგორიცაა მეხსიერების ჟონვა, `detectChanges()`-ის დაკარგვა და იმპლემენტაციის დეტალების ტესტირება

**შემდეგი ნაბიჯები:**

- ივარჯიშეთ ტესტების დაწერაში თქვენი არსებული RxJS კოდისთვის
- გააკეთეთ ტესტების რეფაქტორინგი ამ გზამკვლევში მოცემული პატერნების დაცვით
- დააყენეთ უწყვეტი ინტეგრაცია ტესტების ავტომატურად გაშვებისთვის
- დაისახეთ მიზნად მაღალი ტესტის დაფარვა (80%+) კრიტიკულ გზებზე ფოკუსირებით
- გააზიარეთ ცოდნა თქვენს გუნდთან და დაადგინეთ ტესტირების სტანდარტები

**რესურსები:**

- [Angular-ის ტესტირების დოკუმენტაცია](https://angular.io/guide/testing)
- [RxJS ოფიციალური დოკუმენტაცია](https://rxjs.dev/)
- [Jest-ის დოკუმენტაცია](https://jestjs.io/)
- [ტესტირების საუკეთესო პრაქტიკები](https://angular.io/guide/testing-best-practices)

---

## Final Example:  Complete Test Suite
## საბოლოო მაგალითი: სრული ტესტების ნაკრები

```typescript
// Complete example bringing everything together
// სრული მაგალითი, რომელიც აერთიანებს ყველაფერს

describe('Complete Test Suite Example - სრული ტესტების მაგალითი', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let httpMock: HttpTestingController;
  let mockNotificationService: jest.Mocked<NotificationStreamService>;

  beforeEach(async () => {
    mockNotificationService = {
      addNotification: jest.fn(),
      notifications$: of([])
    } as any;

    await TestBed.configureTestingModule({
      declarations: [UserDashboardComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        UserService,
        ProductService,
        { provide: NotificationStreamService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Initialization - ინიციალიზაცია', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should load initial data', (done) => {
      fixture.detectChanges();

      const req = httpMock.expectOne('/api/users');
      req.flush(mockUsers);

      fixture.whenStable().then(() => {
        expect(component.users).toEqual(mockUsers);
        done();
      });
    });
  });

  describe('User Interactions - მომხმარებლის ინტერაქციები', () => {
    it('should filter users on search', fakeAsync(() => {
      fixture.detectChanges();
      
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'გიორგი';
      input.dispatchEvent(new Event('input'));
      
      tick(300); // debounce time
      fixture.detectChanges();
      
      expect(component.filteredUsers. length).toBeGreaterThan(0);
    }));
  });

  describe('Error Handling - შეცდომების დამუშავება', () => {
    it('should handle API errors gracefully', (done) => {
      fixture.detectChanges();

      const req = httpMock.expectOne('/api/users');
      req.error(new ProgressEvent('error'));

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        
        expect(component.error).toBeTruthy();
        expect(mockNotificationService.addNotification).toHaveBeenCalledWith({
          message: expect.any(String),
          type: 'error'
        });
        
        done();
      });
    });
  });

  describe('Cleanup - გაწმენდა', () => {
    it('should unsubscribe on destroy', () => {
      const spy = jest.spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });
  });
});
```

**English:**
This comprehensive guide provides you with all the tools and knowledge you need to write effective RxJS tests in Angular using Jest and TestBed. Happy testing!  🚀

**ქართული:**
ეს ყოვლისმომცველი გზამკვლევი გაძლევთ ყველა იარაღს და ცოდნას, რაც გჭირდებათ ეფექტური RxJS ტესტების დასაწერად Angular-ში Jest-ისა და TestBed-ის გამოყენებით. წარმატებული ტესტირება!  🚀
