'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FiSearch, FiPlus, FiBook } from 'react-icons/fi';
import { bookService } from '@/lib/books';
import { categoryService } from '@/lib/categories';
import { reservationService } from '@/lib/reservations';
import { authService } from '@/lib/auth';
import { BookList, Category, User } from '@/types';

export default function BooksPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const mediaBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  const [books, setBooks] = useState<BookList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksData, categoriesData, userData] = await Promise.all([
        bookService.getBooks(),
        categoryService.getCategories(),
        authService.getCurrentUser(),
      ]);

      // Ensure books and categories are arrays
      setBooks(booksData.results || []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.results || []);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setBooks([]);
      setCategories([]);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    try {
      const results = await bookService.searchBooks(searchQuery);
      setBooks(results || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleReserve = async (bookId: number) => {
    try {
      await reservationService.createReservation({ book: bookId });
      alert('Book reserved successfully!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to reserve book');
    }
  };

  const getCoverImageUrl = (coverImage?: string | null) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
      return coverImage;
    }
    if (coverImage.startsWith('/')) {
      return `${mediaBaseUrl}${coverImage}`;
    }
    return `${mediaBaseUrl}/${coverImage}`;
  };

  const filteredBooks = books.filter((book) => {
    if (selectedCategory && book.category_name !== selectedCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          {user?.user_type === 'staff' && (
            <Button onClick={() => setShowAddModal(true)}>
              <FiPlus className="mr-2" /> Add Book
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by title, author, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <FiSearch className="mr-2" /> Search
                </Button>
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                  <div className="ml-2 w-16 h-20 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                    {getCoverImageUrl(book.cover_image) ? (
                      <img
                        src={getCoverImageUrl(book.cover_image) as string}
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiBook className="text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISBN:</span>
                    <span className="font-medium">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{book.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium capitalize ${
                        book.status === 'available' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">
                      {book.available_copies} / {book.total_copies}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {book.is_available && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleReserve(book.id)}
                      className="flex-1"
                    >
                      Reserve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/books/${book.id}`)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
}
