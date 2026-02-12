'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { transactionService } from '@/lib/transactions';
import { authService } from '@/lib/auth';
import { Transaction, User } from '@/types';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'returned'>('all');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [router, filter]);

  const fetchData = async () => {
    try {
      const [userData, transactionsData] = await Promise.all([
        authService.getCurrentUser(),
        filter === 'active'
          ? transactionService.getActiveTransactions()
          : filter === 'overdue'
          ? transactionService.getOverdueTransactions()
          : transactionService.getTransactions({ status: filter === 'returned' ? 'returned' : undefined }),
      ]);
      setUser(userData);
      setTransactions(Array.isArray(transactionsData) ? transactionsData : transactionsData.results);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (transactionId: number) => {
    if (!confirm('Are you sure you want to return this book?')) return;
    
    try {
      await transactionService.returnBook({ transaction_id: transactionId });
      alert('Book returned successfully!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to return book');
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Transactions</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            onClick={() => setFilter('active')}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filter === 'overdue' ? 'primary' : 'secondary'}
            onClick={() => setFilter('overdue')}
            size="sm"
          >
            Overdue
          </Button>
          <Button
            variant={filter === 'returned' ? 'primary' : 'secondary'}
            onClick={() => setFilter('returned')}
            size="sm"
          >
            Returned
          </Button>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {transaction.book_title}
                    </h3>
                    {transaction.is_overdue && !transaction.return_date && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        Overdue
                      </span>
                    )}
                    {transaction.return_date && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Returned
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ISBN:</span>
                      <p className="font-medium">{transaction.book_isbn}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Issue Date:</span>
                      <p className="font-medium">{format(new Date(transaction.issue_date), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Due Date:</span>
                      <p className="font-medium">{format(new Date(transaction.due_date), 'MMM dd, yyyy')}</p>
                    </div>
                    {transaction.return_date && (
                      <div>
                        <span className="text-gray-600">Return Date:</span>
                        <p className="font-medium">{format(new Date(transaction.return_date), 'MMM dd, yyyy')}</p>
                      </div>
                    )}
                  </div>

                  {transaction.is_overdue && !transaction.return_date && (
                    <div className="flex items-center gap-2 text-red-600">
                      <FiAlertCircle />
                      <span className="text-sm">Overdue by {transaction.days_overdue} days</span>
                    </div>
                  )}

                  {transaction.fine_amount > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-600">Fine:</span>
                      <span className={`ml-2 font-medium ${transaction.fine_paid ? 'text-green-600' : 'text-red-600'}`}>
                        ${transaction.fine_amount} {transaction.fine_paid ? '(Paid)' : '(Unpaid)'}
                      </span>
                    </div>
                  )}
                </div>

                {!transaction.return_date && user?.user_type === 'staff' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleReturnBook(transaction.id)}
                  >
                    <FiCheckCircle className="mr-2" /> Return
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <FiRefreshCw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
