"use client";

import { addMessage, addMessageContent } from "@/lib/database/mutation";
import { Message, MessageImage } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import MessageArea from "./message-area";
import { User } from "next-auth";
import { pusherClient } from "@/lib/pusher/pusher";
import { compareAsc } from "date-fns";
import Image from "next/image";
import { Button } from "./ui/button";
import { CircleX, Paperclip, Plus, SendHorizontal } from "lucide-react";
import {
  getSignatureServer,
  uploadPhotoContentDB,
} from "@/lib/cloudinary/actions";
// & { messageId: MessageImage }

type MessageType = {
  recipientId: string;
  messages: ({ messageId: MessageImage | null } & Message)[];
  user: User;
  privateChatId: string;
  recepientImage: string;
};

export default function Messages({
  recipientId,
  messages,
  user,
  privateChatId,
  recepientImage,
}: MessageType) {
  // const privateChatId = "the-private-room"; //need to make it better
  const messageRef = useRef<HTMLInputElement>(null);
  const targetElement = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | null>();
  // const [content,setContent] = useState<string | undefined>()

  const [incomingMessages, setIncomingMessage] = useState(
    [] as (Message & { messageId?: MessageImage })[],
  );

  useEffect(() => {
    pusherClient.subscribe(privateChatId);

    pusherClient.bind(
      "incoming-messages",
      (response: {
        recipientId: string;
        content: string;
        senderId: string;
        id: string;
        url: string;
      }) => {
        // console.log(response.recipientId);
        // console.log(response);
        if (response.content || response.url) {
          const incomingMsg: Message & { messageId?: MessageImage } = {
            id: response.id,
            senderId: response.senderId,
            recepientId: response.recipientId,
            content: response.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            messageId: response.url
              ? {
                  id: "",
                  imageUrl: response.url,
                  senderId: "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  messageId: "",
                }
              : undefined,
          };
          setIncomingMessage((prev) =>
            [...prev, incomingMsg].sort((a, b) =>
              compareAsc(a.createdAt, b.createdAt),
            ),
          );
          // console.log(incomingMsg);
          targetElement?.current?.scrollIntoView({ behavior: "smooth" });
        }
      },
    );

    return () => {
      pusherClient.unsubscribe(privateChatId);
    };
  }, [privateChatId]);
  // console.log(incomingMessages);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  const handleSubmitClick = async (e: any) => {
    e.preventDefault();
    try {
      // console.log(file);
      let content;
      if (file) {
        const getSignature = await getSignatureServer();
        const cloud_name = process.env.NEXT_PUBLIC_CLOUD_NAME;

        // signature timestamp api_key
        const cloudinaryURl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
        if (!getSignature.success) return;

        const data = new FormData();
        data.append("file", file);
        data.append("timestamp", `${getSignature.success.timestamp}`);
        data.append("api_key", process.env.NEXT_PUBLIC_CLOUD_API_KEY!);
        data.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET!,
        );

        const response = await fetch(cloudinaryURl, {
          method: "POST",
          body: data,
        });

        const responseData = await response.json();

        const photoData = {
          public_id: responseData.public_id,
          version: responseData.version,
          signature: responseData.signature,
          url: responseData.url,
        };

        content = messageRef.current?.value;
        if (!content) content = "";
        await uploadPhotoContentDB(
          photoData,
          content,
          recipientId,
          privateChatId,
        );
        messageRef!.current!.value = "";
      } else {
        content = messageRef.current?.value as string;
        const response = await addMessage(recipientId, content, privateChatId);
        if (response) {
          console.log("Message successfully sent");
          messageRef!.current!.value = "";
          targetElement?.current?.scrollIntoView({ behavior: "smooth" });
          messageRef!.current!.value = "";
        }
      }
    } catch (error) {
    } finally {
      setFile(undefined);
      setFileUrl(undefined);
    }
  };

  return (
    <div>
      <MessageArea
        messages={messages}
        user={user}
        targetElement={targetElement}
        incomingMsgs={
          incomingMessages as (Message & { messageId: MessageImage })[]
        }
        recepientImage={recepientImage}
      />

      {file && fileUrl && (
        <div className="absolute bottom-[55px] flex">
          <div className="max-h-[300px] w-[400px] border-2 border-black">
            {/* <h2>Little preview</h2> */}
            <Image
              src={fileUrl}
              alt={file.name}
              width="400"
              height="500"
              className="object-cover"
            />
          </div>
          <div>
            <button
              onClick={() => {
                setFile(undefined);
                setFileUrl(undefined);
              }}
              title="remove button"
              className="bg-transparent"
            >
              <CircleX />
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 right-2 m-0 rounded-md">
        {/* action={handleSubmit} */}
        <form className="relative flex items-center py-1">
          <label htmlFor="content" className="hidden">
            Send
          </label>
          <input
            type="text"
            id="content"
            name="content"
            placeholder="Enter Message"
            className="h-7 w-full flex-1 rounded-md border border-gray-300 px-3 py-6 focus:border-black focus:outline-none"
            ref={messageRef}
          />
          <input
            type="file"
            id="media"
            name="media"
            hidden
            placeholder="Enter Message"
            className="h-[90px] w-[250px] flex-1 rounded-md border border-black px-3 py-5"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleChange}
          />
          <div className="absolute right-2">
            <div className="flex">
              <label
                htmlFor="media"
                className="mr-3 flex cursor-pointer items-center rounded-full border-0 bg-[#e0e2e3] px-2 py-2 text-sm font-semibold text-black shadow-md"
              >
                <Plus />
              </label>
              <Button
                type="submit"
                onClick={handleSubmitClick}
                className="h-full bg-black text-white hover:bg-black/90"
              >
                <SendHorizontal />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
