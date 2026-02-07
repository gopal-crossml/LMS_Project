# 📁 Library Management System - Project Structure

## Complete File Tree

```
library-management-system/
├── 📄 README.md                          # Main project documentation
├── 📄 SETUP_GUIDE.md                     # Detailed setup instructions
├── 📄 COMPETITION_HIGHLIGHTS.md          # Why this project wins
├── 🔧 quickstart.sh                      # Quick setup script
│
├── 📂 backend/                           # Django Backend
│   ├── 📂 library_system/               # Main Django project
│   │   ├── __init__.py
│   │   ├── settings.py                  # Django settings
│   │   ├── urls.py                      # URL configuration
│   │   ├── wsgi.py                      # WSGI config
│   │   └── asgi.py                      # ASGI config
│   │
│   ├── 📂 users/                        # User management app
│   │   ├── __init__.py
│   │   ├── models.py                    # User model with roles
│   │   ├── serializers.py               # DRF serializers
│   │   ├── views.py                     # API viewsets
│   │   ├── admin.py                     # Django admin config
│   │   └── apps.py
│   │
│   ├── 📂 books/                        # Book management app
│   │   ├── __init__.py
│   │   ├── models.py                    # Book, Author, Publisher, Category
│   │   ├── serializers.py               # DRF serializers
│   │   ├── views.py                     # API viewsets
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── 📂 transactions/                 # Issue/Return system
│   │   ├── __init__.py
│   │   ├── models.py                    # Transaction, Reservation
│   │   ├── serializers.py               # DRF serializers
│   │   ├── views.py                     # API viewsets
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── 📄 manage.py                     # Django management script
│   ├── 📄 requirements.txt              # Python dependencies
│   ├── 📄 .env.example                  # Environment template
│   └── 📄 .gitignore
│
├── 📂 frontend/                         # Next.js Frontend
│   ├── 📂 src/
│   │   ├── 📂 app/                      # Next.js app directory
│   │   │   ├── layout.tsx               # Root layout
│   │   │   ├── page.tsx                 # Landing page
│   │   │   ├── globals.css              # Global styles
│   │   │   │
│   │   │   ├── 📂 (auth)/              # Auth pages group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx         # Login page
│   │   │   │   └── register/
│   │   │   │       └── page.tsx         # Registration page
│   │   │   │
│   │   │   └── 📂 (dashboard)/         # Dashboard group
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx         # Main dashboard
│   │   │       ├── books/
│   │   │       │   └── page.tsx         # Browse books
│   │   │       ├── my-books/
│   │   │       │   └── page.tsx         # Current borrowings
│   │   │       ├── reservations/
│   │   │       │   └── page.tsx         # User reservations
│   │   │       └── profile/
│   │   │           └── page.tsx         # User profile
│   │   │
│   │   ├── 📂 components/               # React components
│   │   │   ├── DashboardLayout.tsx      # Main layout
│   │   │   ├── BookCard.tsx             # Book display card
│   │   │   ├── SearchBar.tsx            # Search component
│   │   │   ├── FilterPanel.tsx          # Filters
│   │   │   └── ...
│   │   │
│   │   └── 📂 lib/                      # Utilities
│   │       ├── api.ts                   # API service layer
│   │       ├── store.ts                 # Zustand state management
│   │       └── utils.ts                 # Helper functions
│   │
│   ├── 📂 public/                       # Static assets
│   │   └── images/
│   │
│   ├── 📄 package.json                  # Node dependencies
│   ├── 📄 tsconfig.json                 # TypeScript config
│   ├── 📄 tailwind.config.js            # Tailwind CSS config
│   ├── 📄 next.config.js                # Next.js config
│   ├── 📄 postcss.config.js             # PostCSS config
│   └── 📄 .gitignore
│
└── 📂 docs/                             # Additional documentation
    ├── API.md                            # API documentation
    ├── DATABASE_SCHEMA.md                # Database structure
    └── FEATURES.md                       # Feature list
```

## Key Files Explained

### Backend

#### `library_system/settings.py`
- Database configuration (MySQL)
- REST Framework settings
- JWT authentication config
- CORS settings
- Static/media file configuration

#### `users/models.py`
- Custom User model extending AbstractBaseUser
- Support for Students, Staff, External Users, Admins
- Profile fields, borrowing limits, membership tracking

#### `books/models.py`
- Book model with ISBN, title, authors, categories
- Author, Publisher, Category models
- BookCopy model for tracking individual copies

#### `transactions/models.py`
- Transaction model for issue/return tracking
- Automatic fine calculation
- Reservation model for book holds

#### `*/views.py`
- ViewSets for all models
- Custom actions (issue, return, renew, etc.)
- Filtering, searching, ordering
- Statistics endpoints

### Frontend

#### `src/lib/api.ts`
- Axios configuration
- API endpoint functions
- Request/response interceptors
- Automatic token refresh

#### `src/lib/store.ts`
- Zustand stores for:
  - Authentication state
  - Books state
  - UI state
- Global state management

#### `src/app/globals.css`
- Custom CSS with Tailwind
- Design system variables
- Component classes
- Animations

#### `src/components/DashboardLayout.tsx`
- Main application layout
- Sidebar navigation
- Header with user menu
- Responsive design

## Database Schema

### Tables
1. **users** - User accounts and profiles
2. **books** - Book catalog
3. **authors** - Author information
4. **publishers** - Publisher information
5. **categories** - Book categories
6. **book_copies** - Individual book copies
7. **book_authors** - Many-to-many relationship
8. **book_categories** - Many-to-many relationship
9. **transactions** - Issue/return records
10. **reservations** - Book hold requests

## API Endpoints Summary

### Authentication
- `/api/auth/login/` - Login
- `/api/auth/refresh/` - Token refresh
- `/api/users/` - User registration

### Books
- `/api/books/` - CRUD operations
- `/api/authors/` - Author management
- `/api/publishers/` - Publisher management
- `/api/categories/` - Category management

### Transactions
- `/api/transactions/` - Transaction management
- `/api/transactions/issue/` - Issue book
- `/api/transactions/return_book/` - Return book
- `/api/transactions/renew/` - Renew book

### Reservations
- `/api/reservations/` - Reservation management

## Technology Stack Summary

### Backend
- **Framework**: Django 5.0
- **API**: Django REST Framework 3.14
- **Database**: MySQL 8.0
- **Auth**: JWT (djangorestframework-simplejwt)
- **Docs**: drf-spectacular (Swagger)

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **HTTP**: Axios
- **Animation**: Framer Motion
- **Forms**: React Hook Form

## Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Making Changes**
   - Models: Update model → makemigrations → migrate
   - API: Update serializer → update view → test
   - Frontend: Update component → test → commit

## Production Checklist

- [ ] Update Django SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Setup production database
- [ ] Configure static file serving
- [ ] Setup HTTPS
- [ ] Configure CORS properly
- [ ] Setup error logging
- [ ] Configure backup system
- [ ] Setup monitoring
- [ ] Load test application

## Security Features

1. **Authentication**
   - JWT with refresh tokens
   - Password hashing (PBKDF2)
   - Token expiration

2. **Authorization**
   - Role-based access control
   - Permission checks on all endpoints
   - User-specific data filtering

3. **Data Protection**
   - CORS configuration
   - CSRF protection
   - SQL injection prevention (ORM)
   - XSS protection

4. **Input Validation**
   - Django form validation
   - DRF serializer validation
   - Frontend form validation

## Performance Optimizations

1. **Database**
   - Proper indexing
   - Query optimization
   - Connection pooling

2. **API**
   - Pagination
   - Field selection
   - Caching headers

3. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Static generation where possible

## Testing Strategy

1. **Backend Tests**
   - Model tests
   - API endpoint tests
   - Authentication tests
   - Permission tests

2. **Frontend Tests**
   - Component tests
   - Integration tests
   - E2E tests

## Deployment Options

1. **Backend**
   - Railway
   - Heroku
   - DigitalOcean
   - AWS EC2
   - Docker/Kubernetes

2. **Frontend**
   - Vercel (recommended)
   - Netlify
   - AWS Amplify
   - Cloudflare Pages

---

This structure ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Best practices
- ✅ Production readiness
