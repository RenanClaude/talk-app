import { getChats } from "@/lib/requests";
import { userAuthSotre } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { Chat, UpdateChatEvent } from "@/types/Chat";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { socket } from "../Providers";

type LeftSideProps = {
  variant?: "mobile" | "desktop";
};

export const LeftSide = ({ variant = "desktop" }: LeftSideProps) => {
  const { chat: currentChat, chats, setChats, setChat, setShowNewChat } = useChatStore();
  const { user } = userAuthSotre();

  const [queryInput, setQueryInput] = useState("");
  const [chatsFiltered, setChatsFiltered] = useState<Chat[]>([]);

  const handleGetChats = async () => {
    const response = await getChats();
    if (response.data) {
      setChats(response.data.chats);
    }
  };

  const handleFilterChats = () => {
    if (!chats) return;
    setChatsFiltered(
      chats?.filter((chat) =>
        chat.user.name.toLowerCase().includes(queryInput.toLowerCase())
      )
    );
  };

  useEffect(() => {
    handleGetChats();
  }, []);

  useEffect(() => {
    if (!queryInput && chats) setChatsFiltered(chats);
  }, [chats]);

  useEffect(() => {
    const handleUpdateChat = (data: UpdateChatEvent) => {
      if (user && data.query.users.includes(user.id)) handleGetChats();
      if (data.type === "delete" && data.query.chat_id === currentChat?.id) {
        setChat(null);
        toast("A conversa foi deletada.", { position: "top-center" });
      }
    };
    socket.on("update_chat", handleUpdateChat);
    return () => {
      socket.off("update_chat", handleUpdateChat);
    };
  }, [currentChat]);

  return <div></div>;
};