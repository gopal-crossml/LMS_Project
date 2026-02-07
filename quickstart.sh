#!/bin/bash

echo "🚀 Library Management System - Quick Start"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.10+${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL is not installed. Please install MySQL 8.0+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are installed${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Setup environment file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your MySQL credentials${NC}"
    echo "   DB_NAME=library_db"
    echo "   DB_USER=your_mysql_user"
    echo "   DB_PASSWORD=your_mysql_password"
    echo ""
    read -p "Press Enter after you've configured the database..."
fi

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Check if superuser exists
echo "Checking for admin user..."
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print('exists' if User.objects.filter(is_superuser=True).exists() else 'none')" > /tmp/superuser_check

if grep -q "none" /tmp/superuser_check; then
    echo -e "${YELLOW}Creating superuser...${NC}"
    python manage.py createsuperuser
fi

rm /tmp/superuser_check

echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Setup Frontend
cd ../frontend
echo -e "${BLUE}📦 Setting up Frontend...${NC}"

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Setup environment file
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
fi

echo -e "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Final instructions
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo -e "${BLUE}Terminal 1 - Backend:${NC}"
echo "  cd backend"
echo "  source venv/bin/activate  # or venv\\Scripts\\activate on Windows"
echo "  python manage.py runserver"
echo ""
echo -e "${BLUE}Terminal 2 - Frontend:${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open:"
echo "  🌐 Frontend:    http://localhost:3000"
echo "  🔌 Backend API: http://localhost:8000/api"
echo "  👤 Admin:       http://localhost:8000/admin"
echo "  📚 API Docs:    http://localhost:8000/api/docs"
echo ""
echo -e "${YELLOW}Don't forget to configure your MySQL database!${NC}"
echo "=========================================="
