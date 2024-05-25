"use client";

import { addMessage } from "@/lib/database/mutation";
import { Message } from "@prisma/client";
import React, { useId, useOptimistic, useRef } from "react";
import MessageArea from "./message-area";
import { User } from "next-auth";

type MessageType = {
  recipientId: string;
  messages: Message[];
  user: User;
};

export default function Messages({ recipientId, messages, user }: MessageType) {
  //   console.log(messages);
  const messageRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const targetElement = useRef<HTMLDivElement>(null);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newMessage) => [
    ...state,
    {
      id,
      senderId: user!.id!,
      recepientId: recipientId,
      content: newMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get("content") as string;
    if (!content) return;

    addOptimisticMessage(content);
    await addMessage(recipientId, formData);
    messageRef!.current!.value = "";
    targetElement?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <MessageArea
        messages={optimisticMessages}
        user={user}
        targetElement={targetElement}
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
    </div>
  );
}
