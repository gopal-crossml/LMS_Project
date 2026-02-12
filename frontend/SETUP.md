# Library Management System - Setup Guide

## Complete Setup Instructions

### Prerequisites

1. **Backend Setup** (Django REST Framework)
   - Python 3.8+
   - MySQL database
   - Django REST Framework
   - djangorestframework-simplejwt

2. **Frontend Setup** (Next.js)
   - Node.js 18+ and npm
   - Modern web browser

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install django djangorestframework djangorestframework-simplejwt django-filter django-cors-headers pillow mysqlclient
```

### 4. Configure Database

Edit `library_backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'library_db',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### 5. Create MySQL Database
```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Superuser
```bash
python manage.py createsuperuser
```

### 8. Configure CORS (if not already done)

Add to `library_backend/settings.py`:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

### 9. Start Backend Server
```bash
python manage.py runserver
```

Backend will be available at: http://localhost:8000

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd library-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Start Development Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## Testing the Application

### 1. Create Test Data

Access Django Admin: http://localhost:8000/admin

Create:
- Categories (e.g., Fiction, Non-Fiction, Science, History)
- Books with ISBNs and details
- Test users with different roles

### 2. Test User Registration

1. Go to http://localhost:3000/register
2. Register a new user (student/faculty/staff)
3. Login with credentials

### 3. Test Book Operations

**As Regular User:**
- Browse books
- Search books by title/author/ISBN
- Reserve available books
- View personal transactions
- Update profile

**As Staff User:**
- All user features
- Add new books
- Edit/delete books
- Issue books to users
- Process returns
- View all transactions
- Manage users

### 4. Test Transaction Flow

**Issue Book (Staff):**
1. Login as staff user
2. Go to Books page
3. Select a book
4. Issue to a user with due date

**Return Book (Staff):**
1. Go to Transactions
2. Find active transaction
3. Click "Return" button
4. System calculates fine if overdue

**User View:**
1. Login as regular user
2. View "My Transactions"
3. See issued books and due dates
4. View overdue status and fines

### 5. Test Reservation System

1. Login as regular user
2. Find a book that's not available
3. Click "Reserve"
4. View in Reservations page
5. Cancel if needed

## Common Issues and Solutions

### Backend Issues

**Issue: Database connection error**
- Check MySQL is running
- Verify database credentials in settings.py
- Ensure database exists

**Issue: CORS errors**
- Verify CORS settings in settings.py
- Check frontend URL is in CORS_ALLOWED_ORIGINS

**Issue: Migration errors**
- Delete migration files (except __init__.py)
- Delete database
- Re-create database and run migrations

### Frontend Issues

**Issue: API connection refused**
- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify no firewall blocking

**Issue: Authentication not working**
- Clear browser localStorage
- Check JWT settings in backend
- Verify token expiry times

**Issue: Build errors**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check Node.js version (18+)

## Production Deployment

### Backend

1. Set DEBUG = False in settings.py
2. Configure allowed hosts
3. Set up production database
4. Collect static files: `python manage.py collectstatic`
5. Use gunicorn or uwsgi for serving
6. Set up nginx as reverse proxy

### Frontend

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

Or deploy to Vercel/Netlify for automatic deployments.

## API Documentation

Access the browsable API at: http://localhost:8000/api/

Key endpoints:
- Books: /api/books/
- Users: /api/users/
- Transactions: /api/transactions/
- Reservations: /api/reservations/
- Categories: /api/categories/

## Default Test Credentials

Create these via Django admin or registration:

**Staff User:**
- Username: admin
- Password: (set during superuser creation)
- Role: Staff

**Regular User:**
- Create via registration page
- Set appropriate role (student/faculty/external)

## Features Checklist

- [x] User registration and authentication
- [x] User profile management
- [x] Book browsing and search
- [x] Advanced filtering
- [x] Book CRUD operations (staff)
- [x] Category management
- [x] Book issue/return system
- [x] Due date tracking
- [x] Fine calculation
- [x] Reservation system
- [x] Transaction history
- [x] Overdue tracking
- [x] Role-based access control
- [x] Responsive design
- [x] Statistics dashboard

## Support

For issues or questions:
1. Check this setup guide
2. Review README.md
3. Check backend API documentation
4. Review Django admin for data verification

## Development Tips

1. Use Django admin to quickly create test data
2. Monitor browser console for frontend errors
3. Check backend logs for API errors
4. Use Network tab to debug API calls
5. Test with different user roles
6. Verify permissions for each operation
