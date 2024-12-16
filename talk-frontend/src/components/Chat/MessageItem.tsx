import { AudioAttachment, FileAttachment } from "@/types/Attachment";
import { Message } from "@/types/Message";
import { FileText } from "lucide-react";

type MessageItemProps = {
  data: Message;
  onDelete: (messageId: number) => void;
};

const FileMessage = ({ data }: { data: FileAttachment }) => (
  <div className="flex items-center">
    <a href={data.src} target="_blank">
      {data.content_type.startsWith("image/") ? (
        <img
          className="md:max-w-96 h-80 object-cover rounded-md"
          src={data.src}
          alt={data.name}
        />
      ) : data.content_type.startsWith("video/") ? (
        <video
          className="max-w-96 h-80 object-cover rounded-md"
          src={data.src}
          controls={true}
        />
      ) : (
        <div className="flex items-center gap-3.5 py-1 px-2.5">
          <FileText className="size-7" />
          <div>
            <span className="font-bold">{`${data.name}.${data.extension}`}</span>
            <p className="text-sm">
              {data.size} - {data.content_type}
            </p>
          </div>
        </div>
      )}
    </a>
  </div>
);

const AudioMessage = ({ data }: { data: AudioAttachment }) => (
  <audio controls={true}>
    <source src={data.src} type="audio/mpeg" />
  </audio>
);
