import socketio
from django.conf import settings

# Create socket.IO Server
socket = socketio.Server(cors_allowed_origins=settings.CORS_ALLOWED_ORIGINS)
