"use client";

import { addMessage, addMessageContent } from "@/lib/database/mutation";
import { Message } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import MessageArea from "./message-area";
import { User } from "next-auth";
import { pusherClient } from "@/lib/pusher/pusher";
import { compareAsc } from "date-fns";
import Image from "next/image";
import { Button } from "./ui/button";
import { getSignedUrl } from "@/lib/s3/actions";
import { computeSHA256 } from "@/lib/utils";

type MessageType = {
  recipientId: string;
  messages: Message[];
  user: User;
  privateChatId: string;
};

export default function Messages({
  recipientId,
  messages,
  user,
  privateChatId,
}: MessageType) {
  // const privateChatId = "the-private-room"; //need to make it better
  const messageRef = useRef<HTMLInputElement>(null);
  const targetElement = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | null>();
  // const [content,setContent] = useState<string | undefined>()

  const [incomingMessages, setIncomingMessage] = useState<Message[]>([]);

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get("content") as string;
    if (!content) return;

    const media = formData.get("media") as string;
    console.log(media);

    // await addMessage(recipientId, formData, privateChatId);

    // messageRef!.current!.value = "";
    // targetElement?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    pusherClient.subscribe(privateChatId);

    pusherClient.bind(
      "incoming-messages",
      (response: {
        recipientId: string;
        content: string;
        senderId: string;
        id: string;
      }) => {
        // console.log(response.recipientId);
        // console.log(response);
        if (response.content) {
          const incomingMsg = {
            id: response.id,
            senderId: response.senderId,
            recepientId: response.recipientId,
            content: response.content,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setIncomingMessage((prev) =>
            [...prev, incomingMsg].sort((a, b) =>
              compareAsc(a.createdAt, b.createdAt)
            )
          );
          targetElement?.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
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
      let content;
      if (file) {
        const checkSum = await computeSHA256(file);
        const signedUrlResult = await getSignedUrl(
          file.type,
          file.size,
          checkSum,
          recipientId
        );

        if (signedUrlResult.failure !== undefined) {
          console.error(signedUrlResult.failure);
          throw new Error(signedUrlResult.failure);
        }

        const url = signedUrlResult.success!.url;

        const messageId = signedUrlResult.success!.messageId;

        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        // const content = "this is the content";
        content = messageRef.current?.value;
        if (!content) return;
        const updatedMessage = await addMessageContent(content, messageId);
        if (updatedMessage?.failure !== undefined) {
          console.error("something went wrong");
          return;
        }
        console.log("message successfully sent");
      } else {
        content = messageRef.current?.value as string;
        const response = await addMessage(recipientId, content, privateChatId);
        if (response) {
          console.log("Message successfully sent");
          messageRef!.current!.value = "";
          targetElement?.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  return (
    <div>
      {/* {JSON.stringify(incomingMessages)} */}
      <MessageArea
        messages={messages}
        user={user}
        targetElement={targetElement}
        incomingMsgs={incomingMessages}
      />

      {/* {file && fileUrl && (
        <div className="border-2 border-black h-32 w-32 rounded-lg">
          <h2>Little preview</h2>
          <Image
            src={fileUrl}
            alt={file.name}
            width="300"
            height="300"
            className="object-cover "
          />
        </div>
      )} */}

      <div className="absolute bottom-0 w-full">
        {/* action={handleSubmit} */}
        <form className="mt-2 flex ">
          {/* <label htmlFor="content" className="hidden">
            Send
          </label>
          <input
            type="text"
            id="content"
            name="content"
            placeholder="Enter Message"
            className="w-full border border-black h-7 py-5 px-3 rounded-md flex-1"
            ref={messageRef}
          /> */}
          <div className="mb-4">
            <input
              type="file"
              id="media"
              name="media"
              placeholder="Enter Message"
              className="w-full border border-black h-[90px] py-5 px-3 rounded-md flex-1"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleChange}
            />
          </div>
          <Button type="submit" onClick={handleSubmitClick}>
            Submit
          </Button>
        </form>
      </div>

      {/* <Button onClick={() => sendMessage()}>Test real time</Button> */}
    </div>
  );
}
