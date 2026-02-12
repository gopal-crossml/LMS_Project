# Library Management System - Frontend

A modern library management system frontend built with Next.js 14, TypeScript, and Tailwind CSS, designed to work with the Django REST Framework backend.

## Features

### User Management
- User registration (students, staff, external users, faculty)
- User authentication with JWT
- User profile management
- Role-based access control

### Book Management
- Browse and search books
- Filter by category, status, author, language
- View book details (ISBN, author, publisher, availability)
- Add, update, delete books (staff only)
- Multiple copies per book tracking
- Book categories management

### Search & Discovery
- Advanced search by title, author, ISBN, category
- Filter by availability, language, publication year
- Real-time search results

### Issue / Return System
- Book issue tracking
- Due date calculation
- Return processing
- Fine calculation for overdue books
- Transaction history
- Active and overdue transaction views

### Reservation System
- Book reservation/hold requests
- Reservation expiry tracking
- Cancel reservations
- View reservation status

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:8000` (or configure in `.env.local`)

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
library-frontend/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Dashboard page
│   ├── books/             # Books listing and management
│   ├── transactions/      # Transaction history and management
│   ├── reservations/      # Book reservations
│   ├── users/             # User management (staff)
│   └── profile/           # User profile
├── components/            # React components
│   ├── layout/           # Layout components (Navbar)
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── books/            # Book-related components
│   └── transactions/     # Transaction components
├── lib/                   # Utility functions and services
│   ├── api.ts            # API client configuration
│   ├── auth.ts           # Authentication service
│   ├── books.ts          # Book service
│   ├── transactions.ts   # Transaction service
│   ├── reservations.ts   # Reservation service
│   └── categories.ts     # Category service
├── types/                 # TypeScript type definitions
│   └── index.ts          # All type definitions
└── public/               # Static files

## API Endpoints Used

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh
- `POST /api/auth/verify/` - Token verification

### Users
- `GET /api/users/` - List all users (staff)
- `POST /api/users/` - Register new user
- `GET /api/users/me/` - Get current user
- `PUT /api/users/update_profile/` - Update user profile

### Books
- `GET /api/books/` - List books (with pagination and filters)
- `GET /api/books/{id}/` - Get book details
- `POST /api/books/` - Create book (staff)
- `PUT /api/books/{id}/` - Update book (staff)
- `DELETE /api/books/{id}/` - Delete book (staff)
- `GET /api/books/available/` - Get available books
- `GET /api/books/statistics/` - Get book statistics

### Transactions
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/issue_book/` - Issue book (staff)
- `POST /api/transactions/return_book/` - Return book (staff)
- `GET /api/transactions/active/` - Get active transactions
- `GET /api/transactions/overdue/` - Get overdue transactions
- `GET /api/transactions/statistics/` - Get statistics (staff)

### Reservations
- `GET /api/reservations/` - List reservations
- `POST /api/reservations/` - Create reservation
- `POST /api/reservations/{id}/cancel/` - Cancel reservation
- `GET /api/reservations/active/` - Get active reservations

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category (staff)
- `PUT /api/categories/{id}/` - Update category (staff)
- `DELETE /api/categories/{id}/` - Delete category (staff)

## Features by User Role

### All Users
- Browse and search books
- View book details
- Reserve available books
- View personal transactions
- View personal reservations
- Update profile

### Staff Users
- All user features plus:
- Add, edit, delete books
- Issue books to users
- Process book returns
- View all transactions
- View all users
- Manage categories
- View statistics

## Pages

### Public Pages
- `/login` - User login
- `/register` - New user registration

### Protected Pages
- `/dashboard` - Dashboard with statistics
- `/books` - Browse and search books
- `/transactions` - View transaction history
- `/reservations` - Manage book reservations
- `/users` - User management (staff only)
- `/profile` - User profile and settings

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:8000/api)

## Authentication Flow

1. User logs in with username/password
2. Backend returns JWT access and refresh tokens
3. Tokens stored in localStorage
4. Access token sent with every API request
5. Automatic token refresh on 401 errors
6. Redirect to login on authentication failure

## Key Features Implementation

### Search & Filters
- Real-time search across book title, author, ISBN
- Category-based filtering
- Status filtering (available, issued, reserved)
- Language filtering

### Transaction Management
- Issue book with due date calculation
- Return book with fine calculation
- Overdue tracking
- Fine management

### Reservation System
- Reserve books when not available
- Automatic expiry after 7 days
- Cancel reservations
- Track reservation status

## UI Components

### Layout Components
- `Navbar` - Main navigation with authentication state

### UI Components
- `Button` - Reusable button with variants
- `Input` - Form input with label and error handling
- `Card` - Content card wrapper
- `Modal` - Modal dialog

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.

## Support

For issues and questions, please refer to the backend API documentation or contact the development team.
