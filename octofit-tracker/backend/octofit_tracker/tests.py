from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, LeaderBoard, Workout
import datetime


class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            username='testuser',
            email='testuser@example.com',
            password='testpass123',
        )

    def test_get_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'username': 'newuser', 'email': 'newuser@example.com', 'password': 'newpass123'}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='TestTeam', members=[])

    def test_get_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {'name': 'NewTeam', 'members': []}
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.activity = Activity.objects.create(
            user='testuser',
            activity_type='Running',
            duration=30.0,
            date=datetime.date.today(),
        )

    def test_get_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_activity(self):
        data = {
            'user': 'testuser',
            'activity_type': 'Cycling',
            'duration': 45.0,
            'date': str(datetime.date.today()),
        }
        response = self.client.post('/api/activities/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LeaderBoardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.entry = LeaderBoard.objects.create(user='testuser', score=100)

    def test_get_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_leaderboard_entry(self):
        data = {'user': 'anotheruser', 'score': 200}
        response = self.client.post('/api/leaderboard/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class WorkoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            name='Morning Routine',
            description='A light morning workout',
            exercises=['push-ups', 'sit-ups'],
        )

    def test_get_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout(self):
        data = {
            'name': 'Evening Routine',
            'description': 'An evening cooldown workout',
            'exercises': ['stretching', 'yoga'],
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ApiRootTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_root_redirect(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
