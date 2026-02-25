from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, LeaderBoard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Deleting existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        LeaderBoard.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users_data = [
            {'username': 'tony_stark', 'email': 'tony@avengers.com', 'password': 'ironman123'},
            {'username': 'peter_parker', 'email': 'peter@avengers.com', 'password': 'spidey123'},
            {'username': 'natasha_romanoff', 'email': 'natasha@avengers.com', 'password': 'blackwidow123'},
            {'username': 'bruce_banner', 'email': 'bruce@avengers.com', 'password': 'hulk123'},
            {'username': 'bruce_wayne', 'email': 'bruce@gotham.com', 'password': 'batman123'},
            {'username': 'clark_kent', 'email': 'clark@dailyplanet.com', 'password': 'superman123'},
            {'username': 'diana_prince', 'email': 'diana@themyscira.com', 'password': 'wonderwoman123'},
            {'username': 'barry_allen', 'email': 'barry@centralcity.com', 'password': 'flash123'},
        ]
        for u in users_data:
            User.objects.create(**u)

        self.stdout.write('Creating teams...')
        marvel_members = ['tony_stark', 'peter_parker', 'natasha_romanoff', 'bruce_banner']
        dc_members = ['bruce_wayne', 'clark_kent', 'diana_prince', 'barry_allen']
        Team.objects.create(name='Team Marvel', members=marvel_members)
        Team.objects.create(name='Team DC', members=dc_members)

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': 'tony_stark', 'activity_type': 'Running', 'duration': 30.0, 'date': date(2026, 2, 20)},
            {'user': 'peter_parker', 'activity_type': 'Cycling', 'duration': 45.0, 'date': date(2026, 2, 21)},
            {'user': 'natasha_romanoff', 'activity_type': 'Martial Arts', 'duration': 60.0, 'date': date(2026, 2, 22)},
            {'user': 'bruce_banner', 'activity_type': 'Yoga', 'duration': 50.0, 'date': date(2026, 2, 23)},
            {'user': 'bruce_wayne', 'activity_type': 'Strength Training', 'duration': 75.0, 'date': date(2026, 2, 20)},
            {'user': 'clark_kent', 'activity_type': 'Running', 'duration': 20.0, 'date': date(2026, 2, 21)},
            {'user': 'diana_prince', 'activity_type': 'Archery', 'duration': 40.0, 'date': date(2026, 2, 22)},
            {'user': 'barry_allen', 'activity_type': 'Sprinting', 'duration': 15.0, 'date': date(2026, 2, 23)},
        ]
        for a in activities_data:
            Activity.objects.create(**a)

        self.stdout.write('Creating leaderboard...')
        leaderboard_data = [
            {'user': 'tony_stark', 'score': 900},
            {'user': 'peter_parker', 'score': 850},
            {'user': 'natasha_romanoff', 'score': 950},
            {'user': 'bruce_banner', 'score': 800},
            {'user': 'bruce_wayne', 'score': 980},
            {'user': 'clark_kent', 'score': 870},
            {'user': 'diana_prince', 'score': 930},
            {'user': 'barry_allen', 'score': 910},
        ]
        for lb in leaderboard_data:
            LeaderBoard.objects.create(**lb)

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Iron Man Conditioning',
                'description': 'High-intensity full-body workout inspired by Tony Stark',
                'exercises': ['push-ups', 'pull-ups', 'plank', 'burpees', 'deadlifts'],
            },
            {
                'name': 'Spider Agility Drill',
                'description': 'Agility and flexibility workout inspired by Spider-Man',
                'exercises': ['jump rope', 'lateral shuffles', 'box jumps', 'stretching'],
            },
            {
                'name': 'Bat Endurance Circuit',
                'description': 'Endurance and strength circuit inspired by Batman',
                'exercises': ['chin-ups', 'dips', 'running', 'squats', 'resistance training'],
            },
            {
                'name': 'Speed Force Cardio',
                'description': 'Lightning-fast cardio session inspired by The Flash',
                'exercises': ['sprints', 'high knees', 'treadmill intervals', 'cycling'],
            },
        ]
        for w in workouts_data:
            Workout.objects.create(**w)

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
