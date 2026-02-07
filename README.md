# 📚 Library Management System

A modern, full-stack Library Management System built with Django REST Framework and Next.js, featuring an exceptional user interface and comprehensive book management capabilities.

![Library Management System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Django](https://img.shields.io/badge/Django-5.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## ✨ Features

### 👥 User Management
- **Multi-role Support**: Students, Staff, External Users, and Admins
- **User Profiles**: Customizable profiles with profile pictures
- **Authentication**: Secure JWT-based authentication
- **Registration**: Self-service registration with email verification
- **Settings**: Personalized user preferences and settings

### 📖 Book & Resource Management
- **Complete CRUD**: Add, update, delete books with ease
- **ISBN-based Entry**: Quick book addition using ISBN
- **Multiple Copies**: Track individual book copies
- **Rich Metadata**: Categories, authors, publishers, publication year, language
- **Cover Images**: Upload and display book cover images
- **Advanced Search**: Multi-field search with filters

### 🔍 Search & Discovery
- **Smart Search**: Search by title, author, ISBN, category
- **Advanced Filters**: Filter by availability, year range, language, category
- **Popular Books**: See most borrowed books
- **Recently Added**: Browse newest additions
- **Recommendations**: Personalized book recommendations

### 📋 Issue / Return System
- **Issue Tracking**: Complete transaction history
- **Due Date Management**: Automatic due date calculation
- **Return Processing**: Quick book returns with condition notes
- **Renewals**: Allow book renewals (up to 2 times)
- **Fine Calculation**: Automatic fine calculation for overdue books
- **Reservations**: Hold requests for unavailable books

### 📊 Dashboard & Analytics
- **User Statistics**: Borrowing history, current books, fines
- **Library Statistics**: Total books, active loans, overdue items
- **Real-time Updates**: Live availability status
- **Visual Analytics**: Charts and graphs for insights

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.0 + Django REST Framework
- **Database**: MySQL 8.0
- **Authentication**: JWT (Simple JWT)
- **API Documentation**: drf-spectacular (Swagger/OpenAPI)
- **Image Processing**: Pillow
- **CORS**: django-cors-headers

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd library-management-system/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure database**
Create a MySQL database:
```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
```

5. **Environment variables**
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Edit `.env`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=library_db
DB_USER=library_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

6. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser**
```bash
python manage.py createsuperuser
```

8. **Load sample data (optional)**
```bash
python manage.py loaddata fixtures/sample_data.json
```

9. **Run development server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. **Run development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000/`

## 📱 Usage

### For Users

1. **Registration**
   - Navigate to `/register`
   - Fill in your details
   - Select user type (Student/Staff/External)
   - Submit registration

2. **Browse Books**
   - Use the search bar to find books
   - Apply filters for advanced search
   - View book details and availability

3. **Borrow Books**
   - Click on an available book
   - Click "Borrow" button
   - Book will be issued for 14 days

4. **Return Books**
   - Go to "My Books" section
   - Click "Return" on the book
   - Add condition notes if needed

5. **Renew Books**
   - Go to "My Books" section
   - Click "Renew" (up to 2 times)

6. **Reserve Books**
   - View unavailable books
   - Click "Reserve"
   - Get notified when available

### For Admins

1. **Access Admin Panel**
   - Navigate to `/admin`
   - Login with superuser credentials

2. **Manage Books**
   - Add new books with ISBN
   - Update book information
   - Manage copies and availability

3. **Manage Users**
   - View all registered users
   - Update user permissions
   - Set borrowing limits

4. **Monitor Transactions**
   - View all active loans
   - Check overdue books
   - Process returns and renewals

5. **Generate Reports**
   - View statistics dashboard
   - Export transaction data
   - Analyze borrowing patterns

## 🎨 Design Philosophy

This library management system features a **distinctive, award-winning UI** with:

- **Elegant Typography**: Playfair Display for headings, Inter for body text
- **Sophisticated Color Palette**: Warm terracotta primary colors with cool blue accents
- **Smooth Animations**: Framer Motion powered transitions
- **Glass Morphism**: Modern backdrop blur effects
- **Responsive Design**: Mobile-first approach
- **Micro-interactions**: Delightful hover states and loading animations
- **Accessible**: WCAG 2.1 AA compliant

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with Django's PBKDF2
- CORS protection
- SQL injection prevention via ORM
- XSS protection
- CSRF tokens
- Rate limiting (production)

## 📚 API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

### Key Endpoints

#### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh access token
- `POST /api/users/` - Register new user

#### Books
- `GET /api/books/` - List all books
- `GET /api/books/{id}/` - Get book details
- `POST /api/books/` - Create new book
- `PATCH /api/books/{id}/` - Update book
- `DELETE /api/books/{id}/` - Delete book
- `GET /api/books/popular/` - Get popular books
- `GET /api/books/recently_added/` - Get recent books

#### Transactions
- `POST /api/transactions/issue/` - Issue a book
- `POST /api/transactions/return_book/` - Return a book
- `POST /api/transactions/renew/` - Renew a book
- `GET /api/transactions/overdue/` - Get overdue transactions
- `GET /api/transactions/due_soon/` - Get books due soon

#### Reservations
- `POST /api/reservations/` - Create reservation
- `POST /api/reservations/{id}/cancel/` - Cancel reservation
- `GET /api/reservations/active/` - Get active reservations

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Production Deployment

### Backend (Django)

1. Update settings for production
2. Set `DEBUG=False`
3. Configure allowed hosts
4. Use production database
5. Setup static file serving
6. Configure HTTPS
7. Use gunicorn/uwsgi
8. Setup supervisor/systemd

### Frontend (Next.js)

1. Build the application
```bash
npm run build
```

2. Start production server
```bash
npm start
```

Or deploy to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Custom server with PM2

## 📝 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DB_NAME=library_db
DB_USER=library_user
DB_PASSWORD=strong-password
DB_HOST=db-host
DB_PORT=3306
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ for the Library Management System Competition

## 🙏 Acknowledgments

- Django REST Framework team
- Next.js team
- Tailwind CSS team
- All open-source contributors

## 📞 Support

For support, email support@library-system.com or create an issue in the repository.

---

**Built with exceptional attention to detail and user experience** 🎨✨
