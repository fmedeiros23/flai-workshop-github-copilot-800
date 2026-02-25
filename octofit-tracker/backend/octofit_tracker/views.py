from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import User, Team, Activity, LeaderBoard, Workout
from .serializers import (
    UserSerializer,
    TeamSerializer,
    ActivitySerializer,
    LeaderBoardSerializer,
    WorkoutSerializer,
)
import ast


def _parse_members(members):
    if isinstance(members, list):
        return members
    if isinstance(members, str):
        try:
            result = ast.literal_eval(members)
            return result if isinstance(result, list) else []
        except Exception:
            return []
    return []


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'teams': reverse('team-list', request=request, format=format),
        'activities': reverse('activity-list', request=request, format=format),
        'leaderboard': reverse('leaderboard-list', request=request, format=format),
        'workouts': reverse('workout-list', request=request, format=format),
    })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['post'], url_path='assign_team')
    def assign_team(self, request, pk=None):
        user = self.get_object()
        team_id = request.data.get('team_id')

        # Remove user from all current teams
        for team in Team.objects.all():
            members = _parse_members(team.members)
            if user.username in members:
                members.remove(user.username)
                team.members = members
                team.save()

        # Add to new team if specified
        if team_id:
            try:
                new_team = Team.objects.get(pk=team_id)
                members = _parse_members(new_team.members)
                if user.username not in members:
                    members.append(user.username)
                    new_team.members = members
                    new_team.save()
            except Team.DoesNotExist:
                return Response({'error': 'Team not found'}, status=404)

        serializer = self.get_serializer(user)
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderBoardViewSet(viewsets.ModelViewSet):
    queryset = LeaderBoard.objects.all()
    serializer_class = LeaderBoardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
