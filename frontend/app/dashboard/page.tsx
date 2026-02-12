'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import { FiBook, FiUsers, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { bookService } from '@/lib/books';
import { transactionService } from '@/lib/transactions';
import { authService } from '@/lib/auth';
import { BookStatistics, TransactionStatistics, User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loginAt, setLoginAt] = useState<string | null>(null);
  const [bookStats, setBookStats] = useState<BookStatistics | null>(null);
  const [transactionStats, setTransactionStats] = useState<TransactionStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userData, bookData, transData] = await Promise.all([
          authService.getCurrentUser(),
          bookService.getBookStatistics(),
          transactionService.getTransactionStatistics().catch(() => null),
        ]);
        setUser(userData);
        setLoginAt(authService.getLoginAt());
        setBookStats(bookData);
        setTransactionStats(transData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Library Management Dashboard
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Books</p>
                <p className="text-3xl font-bold">{bookStats?.total_books || 0}</p>
              </div>
              <FiBook className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Available Books</p>
                <p className="text-3xl font-bold">{bookStats?.available_books || 0}</p>
              </div>
              <FiBook className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Transactions</p>
                <p className="text-3xl font-bold">{transactionStats?.active_transactions || 0}</p>
              </div>
              <FiRefreshCw className="h-12 w-12 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Overdue Books</p>
                <p className="text-3xl font-bold">{transactionStats?.overdue_transactions || 0}</p>
              </div>
              <FiAlertCircle className="h-12 w-12 text-red-200" />
            </div>
          </Card>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Your Information">
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Username:</span>
                <span className="ml-2 font-medium text-gray-900">{user?.username || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium text-gray-900">{user?.email || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-gray-600">User Type:</span>
                <span className="ml-2 font-medium capitalize text-gray-900">{user?.user_type || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium capitalize text-gray-900">{user?.status || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-gray-600">Login Time:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {loginAt ? new Date(loginAt).toLocaleString() : 'Not available'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Books Issued:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {user?.books_issued_count || 0} / {user?.max_books_allowed || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Member Since:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {user?.membership_start_date
                    ? new Date(user.membership_start_date).toLocaleDateString()
                    : 'Not available'}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-3">
              <button
                onClick={() => router.push('/books')}
                className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-primary-700">Browse Books</span>
              </button>
              <button
                onClick={() => router.push('/transactions')}
                className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-primary-700">My Transactions</span>
              </button>
              <button
                onClick={() => router.push('/reservations')}
                className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-primary-700">My Reservations</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
