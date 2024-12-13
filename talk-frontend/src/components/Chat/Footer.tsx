"use client";

import { useTheme } from "next-themes";
import { ChangeEvent, useRef, useState } from "react";

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

  const mediaRercorder = useRef<MediaRecorder | null>(null);

  const handleToggleEmojiPicker = () => setEmojiPicker(!emojiPicker);

  const handleEmojiSelect = (data: { native: string }) => {
    console.log(data.native);
    setMessageValue(`${messageValue} ${data.native}`);
  };

  const handleUploadAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMessageAttachment(file);
  };

  const handleStartingRecording = () => {};

  return <div></div>;
};
