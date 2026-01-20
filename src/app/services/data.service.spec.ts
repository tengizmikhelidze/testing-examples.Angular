import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService, Product } from './data.service';

describe('DataService - Error Handling', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    { id: 1, name: 'ლეპტოპი', price: 1500, category: 'electronics' },
    { id: 2, name: 'მაუსი', price: 25, category: 'accessories' },
    { id: 3, name: 'Keyboard', price: 75, category: 'accessories' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Testing throwError', () => {
    it('should handle 404 error', (done) => {
      // English: Test that service properly handles 404 errors
      // ქართული: ტესტირება, რომ სერვისი სწორად ამუშავებს 404 შეცდომებს

      service.getProductById(999).subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => {
          expect(error).toBeDefined();
          expect(error.message).toContain('Error Code: 404');
          done();
        }
      });

      const req = httpMock.expectOne('https://api.example.com/products/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 server error', (done) => {
      service.getProducts().subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (error) => {
          expect(error).toBeDefined();
          expect(error.message).toContain('Error Code: 500');
          done();
        }
      });

      // English: Expect 4 requests due to retry(3) + initial request
      // ქართული: ველოდებით 4 მოთხოვნას retry(3) + საწყისი მოთხოვნის გამო
      for (let i = 0; i < 4; i++) {
        const req = httpMock.expectOne('https://api.example.com/products');
        req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      }
    });

    it('should handle network error', (done) => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'Connection failed'
      });

      service.getProducts().subscribe({
        next: () => fail('Should have failed with network error'),
        error: (error) => {
          expect(error).toBeDefined();
          expect(error.message).toContain('Error: Connection failed');
          done();
        }
      });

      for (let i = 0; i < 4; i++) {
        const req = httpMock.expectOne('https://api.example.com/products');
        req.error(errorEvent);
      }
    });
  });

  describe('Testing catchError', () => {
    it('should catch and transform error', (done) => {
      service.createProduct(mockProducts[0]).subscribe({
        next: () => fail('Should have caught error'),
        error: (error) => {
          expect(error).toBeDefined();
          expect(error.message).toContain('Error Code: 400');
          done();
        }
      });

      const req = httpMock.expectOne('https://api.example.com/products');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should successfully create product on retry', (done) => {
      const newProduct = { id: 4, name: 'ახალი პროდუქტი', price: 100, category: 'new' };

      service.createProduct(newProduct).subscribe({
        next: (product) => {
          expect(product).toEqual(newProduct);
          done();
        },
        error: () => fail('Should have succeeded')
      });

      const req = httpMock.expectOne('https://api.example.com/products');
      req.flush(newProduct);
    });
  });

  describe('Success scenarios', () => {
    it('should get all products successfully', (done) => {
      service.getProducts().subscribe({
        next: (products) => {
          expect(products).toEqual(mockProducts);
          expect(products.length).toBe(3);
          done();
        },
        error: () => fail('Should have succeeded')
      });

      const req = httpMock.expectOne('https://api.example.com/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should get product by id successfully', (done) => {
      const expectedProduct = mockProducts[0];

      service.getProductById(1).subscribe({
        next: (product) => {
          expect(product).toEqual(expectedProduct);
          expect(product.name).toBe('ლეპტოპი');
          done();
        },
        error: () => fail('Should have succeeded')
      });

      const req = httpMock.expectOne('https://api.example.com/products/1');
      req.flush(expectedProduct);
    });
  });
});

