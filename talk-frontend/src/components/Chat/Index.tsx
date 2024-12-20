import { createChatMessage, deleteChatMessage, getChatMessages } from "@/lib/requests";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { MarkMessageAsSeenEvent, UpdateMessageEvent } from "@/types/Message";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { socket } from "../Layouts/Providers";
import dayjs from "dayjs";
import { ChatHeader } from "./Header";
import { ScaleLoader } from "react-spinners";
import { MessageItem } from "./MessageItem";
import { ChatFooter } from "./Footer";

export const Chat = () => {
  const { chat, chatMessages, loading, setLoading, setChatMessages } = useChatStore();
  const { user } = useAuthStore();

  const bodyMessageRef = useRef<HTMLDivElement>(null);

  const handleGetMessages = async () => {
    if (!chat) return;
    setLoading(true);
    const response = await getChatMessages(chat.id);
    setLoading(false);

    if (response.error || !response.data) {
      toast.error("Erro ao buscar mensagens", { position: "top-center" });
      return;
    }

    setChatMessages(response.data.messages);
  };

  const handleSendMessage = async ({
    text,
    attachment,
    audio,
  }: {
    text?: string;
    attachment?: File | null;
    audio?: Blob | null;
  }) => {
    // console.log("dataaaaaaaaa: " + text?.length)
    if (!chat) return;
    const formData = new FormData();

    if (attachment) formData.append("file", attachment);
    if (audio) formData.append("audio", audio);
    if (text) formData.append("body", text);

    const response = await createChatMessage(chat.id, formData);

    if (response.error || !response.data) {
      toast.error(response.error.message, { position: "top-center" });
    }
  };

  const handleDeleteMessage = async (message_id: number) => {
    if (!chat) return;
    const response = await deleteChatMessage(chat.id, message_id);

    if (response.error || !response.data) {
      toast.error("Erro ao deletar a mensagem.", { position: "top-center" });
    }
  };

  const scrollToBottom = () => {
    bodyMessageRef.current?.scrollIntoView(false);
  };

  useEffect(() => {
    if (chatMessages === null) handleGetMessages();
  }, [chat]);

  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) scrollToBottom();

    const handleUpdateMessage = (data: UpdateMessageEvent) => {
      if (chatMessages && data.query.chat_id === chat?.id) {
        switch (data.type) {
          case "create":
            if (data.message) setChatMessages([...chatMessages, data.message]);
            break;
          case "delete":
            setChatMessages(
              chatMessages.filter((message) => message.id != data.query.message_id)
            );
        }

        if (data.message && data.message.from_user.id != user?.id) {
          socket.emit("update_messages_as_seen", {
            chat_id: chat.id,
            exclude_user_id: user?.id,
          });
        }
      }
    };

    const handleMarkMessageAsSeen = (data: MarkMessageAsSeenEvent) => {
      if (
        chatMessages &&
        data.query.chat_id === chat?.id &&
        data.query.exclude_user_id !== user?.id
      ) {
        const updatedMessages = chatMessages.map((message) => {
          if (message.viewed_at) return message;
          return { ...message, viewed_at: dayjs().toISOString() };
        });

        setChatMessages(updatedMessages);
      }
    };

    socket.on("update_chat_message", handleUpdateMessage);
    socket.on("mark_messages_as_seen", handleMarkMessageAsSeen);

    return () => {
      socket.off("update_chat_message", handleUpdateMessage);
      socket.off("mark_messages_as_seen", handleMarkMessageAsSeen);
    };
  }, [chatMessages]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ScaleLoader color="#493cdd" />
          </div>
        ) : (
          <div className="space-y-8 p-7" ref={bodyMessageRef}>
            {chatMessages?.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.from_user.id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <MessageItem data={message} onDelete={handleDeleteMessage} />
              </div>
            ))}
          </div>
        )}
      </div>
      <ChatFooter onSendMessage={handleSendMessage} />
    </div>
  );
};