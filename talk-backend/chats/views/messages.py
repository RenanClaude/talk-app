from rest_framework.response import Response

from django.utils.timezone import now
from django.core.files.storage import FileSystemStorage
from django.conf import settings

from chats.models import Chat, ChatMessage
from chats.serializers import ChatSerializer, ChatMessagesSerializer
from chats.views.base import BaseView

from attachments.models import FileAttachment, AudioAttachments

from core.socket import socket
from core.utils.exceptions import ValidationError

import uuid


class ChatMessagesView(BaseView):
    def get(self, request, chat_id):
        # Checking if chat belongs to user
        chat = self.chat_belongs_to_user(
            chat_id=chat_id, user_id=request.user.id
        )

        # Marking messages as seen
        self.mark_messages_as_seen(chat_id=chat_id, user_id=request.user.id)

        # Update all chat messages as seen
        socket.emit(
            "mark_messages_as_seen",
            {"query": {"chat_id": chat_id, "excluse_user_id": request.user.id}},
        )

        # Getting chat messages
        messages = (
            ChatMessage.objects.filter(chat_id=chat_id, deleted_at__isnull=True)
            .order_by("created_at")
            .all()
        )

        serializer = ChatMessagesSerializer(messages, many=True)

        # Sending update chat to user
        socket.emit(
            "update_chat",
            {"query": {"users": [chat.from_user_id, chat.to_user_id]}},
        )

        return Response({"messages": serializer.data})
