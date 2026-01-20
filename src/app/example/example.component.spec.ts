import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError, delay } from 'rxjs';
import { ExampleComponent } from './example.component';
import { UserService, User } from '../services/user.service';
import { SearchService } from '../services/search.service';
import { NotificationService, Notification } from '../services/notification.service';
import { DataService, Product } from '../services/data.service';

describe('ExampleComponent - Integration Tests', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockSearchService: jest.Mocked<SearchService>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockDataService: jest.Mocked<DataService>;

  const mockUsers: User[] = [
    { id: 1, name: 'გიორგი', email: 'giorgi@test.com', role: 'active' },
    { id: 2, name: 'მარიამ', email: 'mariam@test.com', role: 'active' },
    { id: 3, name: 'ნიკა', email: 'nika@test.com', role: 'inactive' }
  ];

  const mockProducts: Product[] = [
    { id: 1, name: 'ლეპტოპი', price: 1500, category: 'electronics' },
    { id: 2, name: 'მაუსი', price: 25, category: 'accessories' }
  ];

  beforeEach(async () => {
    // English: Create mock services
    // ქართული: შევქმნათ მოკ სერვისები
    mockUserService = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      getActiveUsers: jest.fn()
    } as any;

    mockSearchService = {
      search$: of(''),
      onSearch: jest.fn()
    } as any;

    mockNotificationService = {
      showNotification: jest.fn()
    } as any;

    mockDataService = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      createProduct: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ExampleComponent, FormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should load users on init', fakeAsync(() => {
      // English: Mock the service to return users
      // ქართული: მოვახდინოთ სერვისის მოკირება მომხმარებლების დასაბრუნებლად
      mockUserService.getUsers.mockReturnValue(of(mockUsers));
      mockDataService.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();
      tick();

      expect(component.users).toEqual(mockUsers);
      expect(component.loading).toBe(false);
      expect(mockUserService.getUsers).toHaveBeenCalled();
    }));

    it('should load products on init', fakeAsync(() => {
      mockUserService.getUsers.mockReturnValue(of(mockUsers));
      mockDataService.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();
      tick();

      expect(component.products).toEqual(mockProducts);
      expect(mockDataService.getProducts).toHaveBeenCalled();
    }));

    it('should handle error when loading users fails', fakeAsync(() => {
      mockUserService.getUsers.mockReturnValue(
        throwError(() => new Error('Network error'))
      );
      mockDataService.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();
      tick();

      expect(component.error).toBe('Failed to load users');
      expect(component.loading).toBe(false);
    }));
  });

  describe('User Filtering', () => {
    it('should filter active users correctly', () => {
      component.users = mockUsers;

      const activeUsers = component.getActiveUsers();

      expect(activeUsers.length).toBe(2);
      expect(activeUsers.every(u => u.role === 'active')).toBe(true);
    });

    it('should return empty array when no users', () => {
      component.users = [];

      const activeUsers = component.getActiveUsers();

      expect(activeUsers).toEqual([]);
    });
  });

  describe('Search Functionality', () => {
    it('should call search service on input', () => {
      const searchTerm = 'angular';

      component.onSearchInput(searchTerm);

      expect(mockSearchService.onSearch).toHaveBeenCalledWith(searchTerm);
    });

    it('should handle search results from service', fakeAsync(() => {
      // English: Create a real SearchService for testing debounce
      // ქართული: შევქმნათ რეალური SearchService debounce-ის ტესტირებისთვის
      const realSearchService = new SearchService();
      component['searchService'] = realSearchService;
      component.ngOnInit();

      realSearchService.onSearch('test');
      tick(300);

      expect(component.searchResults).toContain('test');
    }));
  });

  describe('Notification Functionality', () => {
    it('should show notification with delay', fakeAsync(() => {
      const mockNotification: Notification = {
        id: 1,
        message: 'წარმატება!',
        type: 'success'
      };

      mockNotificationService.showNotification.mockReturnValue(
        of(mockNotification).pipe(delay(2000))
      );

      component.showNotification('წარმატება!', 'success');

      expect(component.notification).toBeNull();

      tick(2000);

      expect(component.notification).toEqual(mockNotification);
    }));

    it('should handle error notification', fakeAsync(() => {
      const errorNotification: Notification = {
        id: 2,
        message: 'შეცდომა!',
        type: 'error'
      };

      mockNotificationService.showNotification.mockReturnValue(
        of(errorNotification).pipe(delay(2000))
      );

      component.showNotification('შეცდომა!', 'error');
      tick(2000);

      expect(component.notification?.type).toBe('error');
      expect(component.notification?.message).toBe('შეცდომა!');
    }));
  });

  describe('Component Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle product loading error', fakeAsync(() => {
      mockUserService.getUsers.mockReturnValue(of(mockUsers));
      mockDataService.getProducts.mockReturnValue(
        throwError(() => new Error('Server error'))
      );

      component.ngOnInit();
      tick();

      expect(component.error).toBe('Failed to load products');
    }));
  });
});

