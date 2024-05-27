"use client";

import { addMessage } from "@/lib/database/mutation";
import { Message } from "@prisma/client";
import React, {
  useEffect,
  useId,
  useMemo,
  useOptimistic,
  useRef,
  useState,
} from "react";
import MessageArea from "./message-area";
import { User } from "next-auth";
import io from "socket.io-client";
import { Button } from "./ui/button";
import { pusherClient } from "@/lib/pusher/pusher";
import { v4 as uuidv4 } from "uuid";
import { compareAsc } from "date-fns";

type MessageType = {
  recipientId: string;
  messages: Message[];
  user: User;
};

export default function Messages({ recipientId, messages, user }: MessageType) {
  const privateChatId = "the-private-room"; //need to make it better
  const messageRef = useRef<HTMLInputElement>(null);
  const targetElement = useRef<HTMLDivElement>(null);

  // const [optimisticMessages, addOptimisticMessage] = useOptimistic<
  //   Message[],
  //   string
  // >(messages, (state, newMessage) => [
  //   ...state,
  //   {
  //     id,
  //     senderId: user!.id!,
  //     recepientId: recipientId,
  //     content: newMessage,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // ]);

  const [incomingMessages, setIncomingMessage] = useState<Message[]>([]);

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get("content") as string;
    if (!content) return;

    await addMessage(recipientId, formData);

    messageRef!.current!.value = "";
    targetElement?.current?.scrollIntoView({ behavior: "smooth" });
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
        console.log(response);
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
  }, []);
  // console.log(incomingMessages);
  return (
    <div>
      {/* {JSON.stringify(incomingMessages)} */}
      <MessageArea
        messages={messages}
        user={user}
        targetElement={targetElement}
        incomingMsgs={incomingMessages}
      />

      <div className="absolute bottom-0 w-full">
        <form action={handleSubmit} className="mt-2 flex ">
          <label htmlFor="content" className="hidden">
            Send
          </label>
          <input
            type="text"
            id="content"
            name="content"
            placeholder="Enter Message"
            className="w-full border border-black h-7 py-5 px-3 rounded-md flex-1"
            ref={messageRef}
          />
        </form>
      </div>
      {/* <Button onClick={() => sendMessage()}>Test real time</Button> */}
    </div>
  );
}
