"use client";

import { useTheme } from "next-themes";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { X } from "lucide-react";

type ChatFooterProps = {
  onSendMessage: (data: {
    text?: string | null;
    attachment?: File | null;
    audio?: Blob | null;
  }) => void;
};

export const ChatFooter = ({ onSendMessage }: ChatFooterProps) => {
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [messageValue, setMessageValue] = useState("");
  const [messageAttachment, setMessageAttachment] = useState<File | null>(null);

  const theme = useTheme();

  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleToggleEmojiPicker = () => setEmojiPicker(!emojiPicker);

  const handleEmojiSelect = (data: { native: string }) => {
    console.log(data.native);
    setMessageValue(`${messageValue} ${data.native}`);
  };

  const handleUploadAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMessageAttachment(file);
  };

  const handleStartingRecording = async () => {
    let stream: MediaStream | null = null;

    if ("MediaRercorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        stream = streamData;
      } catch (error) {
        toast.error("Habilite as permissões do microfone.", {
          position: "top-center",
        });
        return;
      }
    } else {
      toast.error("Seu navegador não tem suporte para gravação de áudio.", {
        position: "top-center",
      });
      return;
    }

    if (!stream) return;
    setIsRecording(true);
    const media = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined" || event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const handleSendRecording = () => {
    if (!mediaRecorder.current) return;
    setIsRecording(false);
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      onSendMessage({ audio: audioBlob });
      setAudioChunks([]);
    };

    mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
  };

  const handleDeleteRecording = () => {
    if (!mediaRecorder.current) return;
    setIsRecording(false);
    mediaRecorder.current.stop();
    mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
  };

  const handleSendMessage = () => {
    onSendMessage({ text: messageValue, attachment: messageAttachment });
    setMessageAttachment(null);
    setMessageValue("");
  };

  return (
    <div>
      <div
        className={`fixed ml-2 ${
          emojiPicker ? "opacity-100 bottom-16" : "opacity-0 -bottom[440px]"
        } duration-300`}
      >
        <Picker data={data} theme={theme} onEmojiSelect={handleEmojiSelect} />
      </div>

      {messageAttachment && (
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900/80 px-10 py-2 border-t">
          <p className="text-xs">
            Arquivo Carregado: {messageAttachment.name} - {messageAttachment.type}
          </p>
          <X
            onClick={() => setMessageAttachment(null)}
            className="size-4 hover:text-primary cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
