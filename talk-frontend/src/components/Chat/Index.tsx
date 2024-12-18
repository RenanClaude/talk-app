import { createChatMessage, deleteChatMessage, getChatMessages } from "@/lib/requests";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useRef } from "react";
import { toast } from "sonner";

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
        bodyMessageRef.current?.scrollIntoView();
    };

    return (
        <div>
            <div></div>
        </div>
    );
};
