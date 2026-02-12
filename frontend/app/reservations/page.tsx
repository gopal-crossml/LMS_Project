'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiBookmark, FiX } from 'react-icons/fi';
import { reservationService } from '@/lib/reservations';
import { authService } from '@/lib/auth';
import { Reservation } from '@/types';
import { format } from 'date-fns';

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchReservations();
  }, [router]);

  const fetchReservations = async () => {
    try {
      const data = await reservationService.getReservations();
      setReservations(data.results);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      await reservationService.cancelReservation(id);
      alert('Reservation cancelled successfully!');
      fetchReservations();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to cancel reservation');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reservations</h1>

        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {reservation.book_title}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ISBN:</span>
                      <p className="font-medium">{reservation.book_isbn}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Reserved On:</span>
                      <p className="font-medium">
                        {format(new Date(reservation.reservation_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Expires On:</span>
                      <p className="font-medium">
                        {format(new Date(reservation.expiry_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                        reservation.status === 'active' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        reservation.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>

                  {reservation.remarks && (
                    <div className="text-sm">
                      <span className="text-gray-600">Remarks:</span>
                      <p className="mt-1 text-gray-700">{reservation.remarks}</p>
                    </div>
                  )}
                </div>

                {reservation.status === 'active' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleCancel(reservation.id)}
                  >
                    <FiX className="mr-2" /> Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {reservations.length === 0 && (
          <div className="text-center py-12">
            <FiBookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No reservations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
