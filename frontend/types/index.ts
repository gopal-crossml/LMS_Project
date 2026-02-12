// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'staff' | 'student' | 'external' | 'faculty';
  status: 'active' | 'inactive' | 'suspended';
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  profile_picture?: string;
  library_card_number?: string;
  max_books_allowed: number;
  membership_start_date: string;
  membership_end_date?: string;
  books_issued_count: number;
  can_issue_books: boolean;
  is_membership_active: boolean;
  date_joined: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_type: 'staff' | 'student' | 'external' | 'faculty';
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  books_count: number;
  created_at: string;
  updated_at: string;
}

// Book Types
export interface Book {
  id: number;
  title: string;
  subtitle?: string;
  isbn: string;
  isbn_10?: string;
  author: string;
  co_authors?: string;
  publisher: string;
  publication_date?: string;
  edition?: string;
  category: number;
  category_name: string;
  language: string;
  pages?: number;
  format: string;
  status: 'available' | 'issued' | 'reserved' | 'maintenance' | 'lost';
  condition: 'new' | 'good' | 'fair' | 'poor';
  location: string;
  call_number: string;
  total_copies: number;
  available_copies: number;
  issued_copies: number;
  price?: number;
  description?: string;
  cover_image?: string;
  keywords?: string;
  added_date: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookList {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category_name: string;
  status: string;
  available_copies: number;
  total_copies: number;
  is_available: boolean;
  cover_image?: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  user: number;
  user_name: string;
  book: number;
  book_title: string;
  book_isbn: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'issued' | 'returned' | 'overdue' | 'lost';
  fine_amount: number;
  fine_paid: boolean;
  issued_by?: number;
  issued_by_name?: string;
  returned_to?: number;
  returned_to_name?: string;
  remarks?: string;
  is_overdue: boolean;
  days_overdue: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  user: number;
  book: number;
  due_date: string;
  remarks?: string;
}

export interface TransactionReturn {
  transaction_id: number;
  returned_to?: number;
  remarks?: string;
}

// Reservation Types
export interface Reservation {
  id: number;
  user: number;
  user_name: string;
  book: number;
  book_title: string;
  book_isbn: string;
  reservation_date: string;
  expiry_date: string;
  status: 'active' | 'fulfilled' | 'cancelled' | 'expired';
  notified: boolean;
  remarks?: string;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface BookStatistics {
  total_books: number;
  available_books: number;
  issued_books: number;
  total_copies: number;
  available_copies: number;
}

export interface TransactionStatistics {
  total_transactions: number;
  active_transactions: number;
  overdue_transactions: number;
  total_unpaid_fines: number;
}
