from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from catalog.models import Category, Book
from users.models import User


class BookCreatePermissionTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Science')
        self.regular_user = User.objects.create_user(
            username='member',
            email='member@example.com',
            password='pass1234',
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='pass1234',
            is_staff=True,
        )
        self.books_url = reverse('book-list')
        self.payload = {
            'title': 'Clean Architecture',
            'isbn': '9780134494166',
            'author': 'Robert C. Martin',
            'publisher': 'Pearson',
            'category': self.category.id,
            'location': 'A-12',
            'call_number': 'QA76.76.C55',
            'total_copies': 3,
            'available_copies': 3,
        }

    def test_admin_can_create_book(self):
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(self.books_url, self.payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 1)
        self.assertEqual(Book.objects.first().title, self.payload['title'])

    def test_non_admin_cannot_create_book(self):
        self.client.force_authenticate(user=self.regular_user)

        response = self.client.post(self.books_url, self.payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Book.objects.count(), 0)
