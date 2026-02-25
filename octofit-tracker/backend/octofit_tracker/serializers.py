from rest_framework import serializers
from .models import User, Team, Activity, LeaderBoard, Workout
from django.db.models import Sum
import ast


def _parse_list_field(value):
    """Return a proper Python list from either a list or a stringified list."""
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            result = ast.literal_eval(value)
            return result if isinstance(result, list) else [value]
        except Exception:
            return [value]
    return []


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'team']

    def get_id(self, obj):
        return str(obj.pk)

    def get_team(self, obj):
        for team in Team.objects.all():
            if obj.username in _parse_list_field(team.members):
                return {'id': str(team.pk), 'name': team.name}
        return None


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'members']

    def get_id(self, obj):
        return str(obj.pk)

    def get_members(self, obj):
        return _parse_list_field(obj.members)


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity_type', 'duration', 'date']

    def get_id(self, obj):
        return str(obj.pk)


class LeaderBoardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    total_calories = serializers.SerializerMethodField()

    class Meta:
        model = LeaderBoard
        fields = ['id', 'user', 'score', 'team', 'total_calories']

    def get_id(self, obj):
        return str(obj.pk)

    def get_team(self, obj):
        for team in Team.objects.all():
            if obj.user in _parse_list_field(team.members):
                return team.name
        return 'N/A'

    def get_total_calories(self, obj):
        # Estimate 10 calories per minute of activity
        result = Activity.objects.filter(user=obj.user).aggregate(total=Sum('duration'))
        total_minutes = result['total'] or 0
        return round(total_minutes * 10)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    exercises = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'exercises']

    def get_id(self, obj):
        return str(obj.pk)

    def get_exercises(self, obj):
        return _parse_list_field(obj.exercises)
