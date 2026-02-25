from django.contrib import admin
from .models import User, Team, Activity, LeaderBoard, Workout

admin.site.register(User)
admin.site.register(Team)
admin.site.register(Activity)
admin.site.register(LeaderBoard)
admin.site.register(Workout)
