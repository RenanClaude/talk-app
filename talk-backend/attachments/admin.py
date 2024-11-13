from django.contrib import admin

# Register your models here.

from attachments.models import FileAttachment, AudioAttachments

admin.site.register(FileAttachment)
admin.site.register(AudioAttachments)
