import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService, User } from '../services/user.service';
import { SearchService } from '../services/search.service';
import { NotificationService, Notification } from '../services/notification.service';
import { DataService, Product } from '../services/data.service';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit, OnDestroy {
  users: User[] = [];
  products: Product[] = [];
  searchTerm = '';
  searchResults: string[] = [];
  notification: Notification | null = null;
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load users';
          this.loading = false;
        }
      });
  }

  loadProducts(): void {
    this.dataService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          this.error = 'Failed to load products';
        }
      });
  }

  setupSearch(): void {
    this.searchService.search$
      .pipe(takeUntil(this.destroy$))
      .subscribe((term: string) => {
        this.searchResults.push(term);
      });
  }

  onSearchInput(term: string): void {
    this.searchService.onSearch(term);
  }

  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notificationService.showNotification(message, type)
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification: Notification) => {
        this.notification = notification;
      });
  }

  getActiveUsers(): User[] {
    return this.users.filter(u => u.role === 'active');
  }
}

