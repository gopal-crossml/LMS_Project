'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setFormData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone_number: userData.phone_number || '',
        address: userData.address || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile(formData);
      alert('Profile updated successfully!');
      setEditing(false);
      fetchUserData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Personal Information">
            {!editing ? (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium text-gray-900">
                    {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Not provided'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Username:</span>
                  <p className="font-medium text-gray-900">{user?.username || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium text-gray-900">{user?.phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium text-gray-900">{user?.address || 'Not provided'}</p>
                </div>
                <Button onClick={() => setEditing(true)} className="mt-4">
                  Edit Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <div className="flex gap-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <Card title="Library Information">
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">User Type:</span>
                <p className="font-medium capitalize text-gray-900">{user?.user_type || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-gray-600">Library Card Number:</span>
                <p className="font-medium text-gray-900">{user?.library_card_number || 'Not assigned'}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                  user?.status === 'active' ? 'bg-green-100 text-green-800' :
                  user?.status === 'suspended' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user?.status}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Max Books Allowed:</span>
                <p className="font-medium text-gray-900">{user?.max_books_allowed ?? 0}</p>
              </div>
              <div>
                <span className="text-gray-600">Books Currently Issued:</span>
                <p className="font-medium text-gray-900">{user?.books_issued_count ?? 0}</p>
              </div>
              <div>
                <span className="text-gray-600">Member Since:</span>
                <p className="font-medium text-gray-900">
                  {user?.membership_start_date
                    ? new Date(user.membership_start_date).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>
              {user?.membership_end_date && (
                <div>
                  <span className="text-gray-600">Membership Expires:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(user.membership_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
