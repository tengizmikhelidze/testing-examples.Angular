import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user.service';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, name: 'გიორგი გელაშვილი', email: 'giorgi@example.com', role: 'active' },
    { id: 2, name: 'ნინო მამაცაშვილი', email: 'nino@example.com', role: 'active' },
    { id: 3, name: 'David Johnson', email: 'david@example.com', role: 'inactive' }
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
    httpMock.verify();
  });

  describe('Mocking with of()', () => {
    it('should mock observable with of() - immediate emission', (done) => {
      jest.spyOn(service, 'getUsers').mockReturnValue(of(mockUsers));

      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(3);
        expect(users[0].name).toBe('გიორგი გელაშვილი');
        done();
      });
    });

    it('should mock filtered data', (done) => {
      const activeUsers = mockUsers.filter(u => u.role === 'active');
      jest.spyOn(service, 'getActiveUsers').mockReturnValue(of(activeUsers));

      service.getActiveUsers().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users.every(u => u.role === 'active')).toBe(true);
        done();
      });
    });
  });

  describe('HTTP Mocking with HttpTestingController', () => {
    it('should mock HTTP GET request', (done) => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne('https://api.example.com/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should mock HTTP request with specific ID', (done) => {
      const mockUser = mockUsers[0];

      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne('https://api.example.com/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle 404 error gracefully', (done) => {
      service.getUserById(999).subscribe(user => {
        expect(user).toBeNull();
        done();
      });

      const req = httpMock.expectOne('https://api.example.com/users/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should filter active users', (done) => {
      const activeUsers = mockUsers.filter(u => u.role === 'active');

      service.getActiveUsers().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users.every(u => u.role === 'active')).toBe(true);
        done();
      });

      const req = httpMock.expectOne('https://api.example.com/users');
      req.flush(mockUsers);
    });
  });

  describe('Jest Mock Functions', () => {
    it('should mock different return values for different calls', (done) => {
      const spy = jest.spyOn(service, 'getUserById')
        .mockReturnValueOnce(of(mockUsers[0]))
        .mockReturnValueOnce(of(mockUsers[1]));

      service.getUserById(1).subscribe(user => {
        expect(user?.name).toBe('გიორგი გელაშვილი');

        service.getUserById(2).subscribe(user2 => {
          expect(user2?.name).toBe('ნინო მამაცაშვილი');
          expect(spy).toHaveBeenCalledTimes(2);
          done();
        });
      });
    });

    it('should track mock function calls', (done) => {
      jest.spyOn(service, 'getUsers').mockReturnValue(of(mockUsers));

      service.getUsers().subscribe(() => {
        expect(service.getUsers).toHaveBeenCalled();
        expect(service.getUsers).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});

