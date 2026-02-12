'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { FiSearch, FiPlus, FiBook, FiEdit2 } from 'react-icons/fi';
import { bookService } from '@/lib/books';
import { categoryService } from '@/lib/categories';
import { reservationService } from '@/lib/reservations';
import { authService } from '@/lib/auth';
import { transactionService } from '@/lib/transactions';
import apiClient from '@/lib/api';
import { Book, BookCreate, BookList, Category, User } from '@/types';

interface AddBookFormState {
  title: string;
  isbn: string;
  author: string;
  publisher: string;
  location: string;
  call_number: string;
  category: string;
  total_copies: string;
}

interface EditBookFormState {
  title: string;
  isbn: string;
  author: string;
  publisher: string;
  location: string;
  call_number: string;
  category: string;
  total_copies: string;
  available_copies: string;
  status: string;
}

const initialAddBookForm: AddBookFormState = {
  title: '',
  isbn: '',
  author: '',
  publisher: '',
  location: '',
  call_number: '',
  category: '',
  total_copies: '1',
};

const initialEditBookForm: EditBookFormState = {
  title: '',
  isbn: '',
  author: '',
  publisher: '',
  location: '',
  call_number: '',
  category: '',
  total_copies: '1',
  available_copies: '1',
  status: 'available',
};

const getDefaultDueDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
};

const getDefaultReservationExpiry = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
};

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [editBookId, setEditBookId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookList | null>(null);
  const [reserveBook, setReserveBook] = useState<BookList | null>(null);
  const [addBookForm, setAddBookForm] = useState<AddBookFormState>(initialAddBookForm);
  const [editBookForm, setEditBookForm] = useState<EditBookFormState>(initialEditBookForm);
  const [addBookError, setAddBookError] = useState('');
  const [addBookLoading, setAddBookLoading] = useState(false);
  const [editBookError, setEditBookError] = useState('');
  const [editBookLoading, setEditBookLoading] = useState(false);
  const [reserveExpiryDate, setReserveExpiryDate] = useState(getDefaultReservationExpiry());
  const [reserveRemarks, setReserveRemarks] = useState('');
  const [reserveError, setReserveError] = useState('');
  const [reserveLoading, setReserveLoading] = useState(false);
  const [issueUserId, setIssueUserId] = useState('');
  const [issueDueDate, setIssueDueDate] = useState(getDefaultDueDate());
  const [issueRemarks, setIssueRemarks] = useState('');
  const [issueError, setIssueError] = useState('');
  const [issueLoading, setIssueLoading] = useState(false);

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

      // Ensure books are an array
      setBooks(booksData.results || []);
      setCategories(categoriesData);
      setUser(userData);

      if (userData?.is_staff) {
        const usersResponse = await apiClient.get('/users/');
        const usersList = Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.results || [];
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setBooks([]);
      setCategories([]);
      setUser(null);
      setUsers([]);
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

  const openReserveModal = (book: BookList) => {
    setReserveBook(book);
    setReserveError('');
    setReserveRemarks('');
    setReserveExpiryDate(getDefaultReservationExpiry());
    setShowReserveModal(true);
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveBook) return;

    setReserveLoading(true);
    setReserveError('');
    try {
      const expiryDateIso = new Date(`${reserveExpiryDate}T23:59:59`).toISOString();
      await reservationService.createReservation({
        book: reserveBook.id,
        expiry_date: expiryDateIso,
        remarks: reserveRemarks.trim() || undefined,
      });
      alert('Book reserved successfully!');
      setShowReserveModal(false);
      setReserveBook(null);
      fetchData();
    } catch (error: any) {
      const errorData = error.response?.data;
      if (typeof errorData === 'string') {
        setReserveError(errorData);
      } else if (errorData?.detail) {
        setReserveError(errorData.detail);
      } else if (Array.isArray(errorData?.non_field_errors)) {
        setReserveError(errorData.non_field_errors[0]);
      } else {
        setReserveError('Failed to reserve book');
      }
    } finally {
      setReserveLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBookError('');
    setAddBookLoading(true);

    const totalCopies = Number(addBookForm.total_copies || 1);
    const safeTotalCopies = Number.isNaN(totalCopies) || totalCopies < 1 ? 1 : totalCopies;
    const payload: BookCreate = {
      title: addBookForm.title.trim(),
      isbn: addBookForm.isbn.trim(),
      author: addBookForm.author.trim(),
      publisher: addBookForm.publisher.trim(),
      location: addBookForm.location.trim(),
      call_number: addBookForm.call_number.trim(),
      total_copies: safeTotalCopies,
      available_copies: safeTotalCopies,
      category: addBookForm.category ? Number(addBookForm.category) : null,
    };

    try {
      await bookService.createBook(payload);
      setShowAddModal(false);
      setAddBookForm(initialAddBookForm);
      fetchData();
    } catch (error: any) {
      const errorData = error.response?.data;
      if (typeof errorData === 'string') {
        setAddBookError(errorData);
      } else if (errorData?.detail) {
        setAddBookError(errorData.detail);
      } else {
        setAddBookError('Failed to add book. Please check the details.');
      }
    } finally {
      setAddBookLoading(false);
    }
  };

  const openEditModal = async (bookId: number) => {
    setEditBookError('');
    setEditBookLoading(true);
    try {
      const fullBook: Book = await bookService.getBook(bookId);
      setEditBookId(fullBook.id);
      setEditBookForm({
        title: fullBook.title || '',
        isbn: fullBook.isbn || '',
        author: fullBook.author || '',
        publisher: fullBook.publisher || '',
        location: fullBook.location || '',
        call_number: fullBook.call_number || '',
        category: fullBook.category ? String(fullBook.category) : '',
        total_copies: String(fullBook.total_copies ?? 1),
        available_copies: String(fullBook.available_copies ?? 1),
        status: fullBook.status || 'available',
      });
      setShowEditModal(true);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.detail) {
        setEditBookError(errorData.detail);
      } else {
        setEditBookError('Failed to load book details');
      }
      alert('Failed to load book details');
    } finally {
      setEditBookLoading(false);
    }
  };

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookId) return;

    setEditBookError('');
    setEditBookLoading(true);
    try {
      await bookService.updateBook(editBookId, {
        title: editBookForm.title.trim(),
        isbn: editBookForm.isbn.trim(),
        author: editBookForm.author.trim(),
        publisher: editBookForm.publisher.trim(),
        location: editBookForm.location.trim(),
        call_number: editBookForm.call_number.trim(),
        category: editBookForm.category ? Number(editBookForm.category) : undefined,
        total_copies: Number(editBookForm.total_copies || 1),
        available_copies: Number(editBookForm.available_copies || 0),
        status: editBookForm.status as Book['status'],
      });
      setShowEditModal(false);
      setEditBookId(null);
      setEditBookForm(initialEditBookForm);
      fetchData();
    } catch (error: any) {
      const errorData = error.response?.data;
      if (typeof errorData === 'string') {
        setEditBookError(errorData);
      } else if (errorData?.detail) {
        setEditBookError(errorData.detail);
      } else if (Array.isArray(errorData?.non_field_errors)) {
        setEditBookError(errorData.non_field_errors[0]);
      } else {
        setEditBookError('Failed to update book details');
      }
    } finally {
      setEditBookLoading(false);
    }
  };

  const openIssueModal = (book: BookList) => {
    setSelectedBook(book);
    setIssueError('');
    setIssueUserId('');
    setIssueDueDate(getDefaultDueDate());
    setIssueRemarks('');
    setShowIssueModal(true);
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    if (!issueUserId) {
      setIssueError('Please select a user');
      return;
    }

    setIssueLoading(true);
    setIssueError('');
    try {
      await transactionService.issueBook({
        user: Number(issueUserId),
        book: selectedBook.id,
        due_date: issueDueDate,
        remarks: issueRemarks.trim() || undefined,
      });
      alert('Book issued successfully');
      setShowIssueModal(false);
      setSelectedBook(null);
      fetchData();
    } catch (error: any) {
      const errorData = error.response?.data;
      if (typeof errorData === 'string') {
        setIssueError(errorData);
      } else if (errorData?.detail) {
        setIssueError(errorData.detail);
      } else if (Array.isArray(errorData?.non_field_errors)) {
        setIssueError(errorData.non_field_errors[0]);
      } else {
        setIssueError('Failed to issue book. Please check details and try again.');
      }
    } finally {
      setIssueLoading(false);
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
          {user?.is_staff && (
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    <span className="font-medium text-black">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-black">{book.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 ">Status:</span>
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
                    <span className="font-medium text-black">
                      {book.available_copies} / {book.total_copies}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {book.is_available && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openReserveModal(book)}
                      className="flex-1"
                    >
                      Reserve
                    </Button>
                  )}
                  {user?.is_staff && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditModal(book.id)}
                      className="flex-1"
                      disabled={editBookLoading}
                    >
                      <FiEdit2 className="mr-2" /> Edit
                    </Button>
                  )}
                  {user?.is_staff && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openIssueModal(book)}
                      className="flex-1"
                      disabled={!book.is_available}
                    >
                      Issue Book
                    </Button>
                  )}
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

      {user?.is_staff && (
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setAddBookError('');
          }}
          title="Add New Book"
        >
          <form onSubmit={handleAddBook} className="space-y-4">
            {addBookError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                {addBookError}
              </div>
            )}
            <Input
              label="Title"
              value={addBookForm.title}
              onChange={(e) => setAddBookForm({ ...addBookForm, title: e.target.value })}
              required
            />
            <Input
              label="ISBN (13 digits)"
              value={addBookForm.isbn}
              onChange={(e) => setAddBookForm({ ...addBookForm, isbn: e.target.value })}
              required
            />
            <Input
              label="Author"
              value={addBookForm.author}
              onChange={(e) => setAddBookForm({ ...addBookForm, author: e.target.value })}
              required
            />
            <Input
              label="Publisher"
              value={addBookForm.publisher}
              onChange={(e) => setAddBookForm({ ...addBookForm, publisher: e.target.value })}
              required
            />
            <Input
              label="Location"
              value={addBookForm.location}
              onChange={(e) => setAddBookForm({ ...addBookForm, location: e.target.value })}
              required
            />
            <Input
              label="Call Number"
              value={addBookForm.call_number}
              onChange={(e) => setAddBookForm({ ...addBookForm, call_number: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={addBookForm.category}
                onChange={(e) => setAddBookForm({ ...addBookForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">No Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Total Copies"
              type="number"
              min={1}
              value={addBookForm.total_copies}
              onChange={(e) => setAddBookForm({ ...addBookForm, total_copies: e.target.value })}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addBookLoading}>
                {addBookLoading ? 'Adding...' : 'Add Book'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {user?.is_staff && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditBookId(null);
            setEditBookError('');
          }}
          title="Edit Book"
        >
          <form onSubmit={handleEditBook} className="space-y-4">
            {editBookError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                {editBookError}
              </div>
            )}
            <Input
              label="Title"
              value={editBookForm.title}
              onChange={(e) => setEditBookForm({ ...editBookForm, title: e.target.value })}
              required
            />
            <Input
              label="ISBN (13 digits)"
              value={editBookForm.isbn}
              onChange={(e) => setEditBookForm({ ...editBookForm, isbn: e.target.value })}
              required
            />
            <Input
              label="Author"
              value={editBookForm.author}
              onChange={(e) => setEditBookForm({ ...editBookForm, author: e.target.value })}
              required
            />
            <Input
              label="Publisher"
              value={editBookForm.publisher}
              onChange={(e) => setEditBookForm({ ...editBookForm, publisher: e.target.value })}
              required
            />
            <Input
              label="Location"
              value={editBookForm.location}
              onChange={(e) => setEditBookForm({ ...editBookForm, location: e.target.value })}
              required
            />
            <Input
              label="Call Number"
              value={editBookForm.call_number}
              onChange={(e) => setEditBookForm({ ...editBookForm, call_number: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={editBookForm.category}
                onChange={(e) => setEditBookForm({ ...editBookForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">No Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editBookForm.status}
                onChange={(e) => setEditBookForm({ ...editBookForm, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <Input
              label="Total Copies"
              type="number"
              min={1}
              value={editBookForm.total_copies}
              onChange={(e) => setEditBookForm({ ...editBookForm, total_copies: e.target.value })}
              required
            />
            <Input
              label="Available Copies"
              type="number"
              min={0}
              value={editBookForm.available_copies}
              onChange={(e) => setEditBookForm({ ...editBookForm, available_copies: e.target.value })}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editBookLoading}>
                {editBookLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <Modal
        isOpen={showReserveModal}
        onClose={() => {
          setShowReserveModal(false);
          setReserveBook(null);
          setReserveError('');
        }}
        title={`Reserve Book${reserveBook ? `: ${reserveBook.title}` : ''}`}
      >
        <form onSubmit={handleReserve} className="space-y-4">
          {reserveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {reserveError}
            </div>
          )}
          <Input
            label="Expiry Date"
            type="date"
            value={reserveExpiryDate}
            onChange={(e) => setReserveExpiryDate(e.target.value)}
            required
          />
          <Input
            label="Remarks (optional)"
            value={reserveRemarks}
            onChange={(e) => setReserveRemarks(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowReserveModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={reserveLoading}>
              {reserveLoading ? 'Reserving...' : 'Confirm Reservation'}
            </Button>
          </div>
        </form>
      </Modal>

      {user?.is_staff && (
        <Modal
          isOpen={showIssueModal}
          onClose={() => {
            setShowIssueModal(false);
            setSelectedBook(null);
            setIssueError('');
          }}
          title={`Issue Book${selectedBook ? `: ${selectedBook.title}` : ''}`}
        >
          <form onSubmit={handleIssueBook} className="space-y-4">
            {issueError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                {issueError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
              <select
                value={issueUserId}
                onChange={(e) => setIssueUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Choose a user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.first_name} {u.last_name})
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Due Date"
              type="date"
              value={issueDueDate}
              onChange={(e) => setIssueDueDate(e.target.value)}
              required
            />
            <Input
              label="Remarks (optional)"
              value={issueRemarks}
              onChange={(e) => setIssueRemarks(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowIssueModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={issueLoading}>
                {issueLoading ? 'Issuing...' : 'Issue Book'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
