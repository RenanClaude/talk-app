"use client";

import { useTheme } from "next-themes";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

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

  return <div></div>;
};
