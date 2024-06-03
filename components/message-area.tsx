import { checkUser, cn, getDay } from "@/lib/utils";
import { Message, MessageImage } from "@prisma/client";
import { format } from "date-fns";
import { User } from "next-auth";
import Image from "next/image";
import React, { useEffect } from "react";

export default function MessageArea({
  messages,
  user,
  targetElement,
  incomingMsgs,
}: {
  messages: (Message & { messageId: MessageImage })[];
  user: User;
  targetElement: React.RefObject<HTMLDivElement>;
  incomingMsgs: Message[];
}) {
  useEffect(() => {
    targetElement?.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="mt-2 flex-1 space-y-1 overflow-y-scroll px-1"
      style={{ height: "calc(100vh - 95px)" }}
      // initially 80px
    >
      {messages?.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "flex-row-reverse": checkUser(message.senderId, user!.id!),
            "flex-row": !checkUser(message.senderId, user.id!),
          })}
        >
          <div
            className={cn("rounded-sm px-2 py-2 text-white", {
              "bg-[#131720]": checkUser(message.senderId, user!.id!),
              "bg-[#2d3748]": !checkUser(message.senderId, user!.id!),
            })}
          >
            {/* {message} */}
            {message.messageId && (
              <a
                href={message.messageId.imageUrl}
                target="_blank"
                title="media_link"
              >
                <Image
                  src={message.messageId.imageUrl}
                  alt={message.id}
                  width={200}
                  height={200}
                  objectFit="cover"
                />
              </a>
            )}
            <p>{message.content}</p>
            <span className="text-[10px] text-gray-200">
              {format(message.createdAt, "HH:mm")}/ {getDay(message.createdAt)}
              <br />
            </span>
          </div>
        </div>
      ))}
      {/* for incoming messages */}

      {incomingMsgs.length > 0 &&
        incomingMsgs?.map((message: Message) => (
          <div
            key={message.id}
            className={cn("flex", {
              "flex-row-reverse": checkUser(message.senderId, user!.id!),
              "flex-row": !checkUser(message.senderId, user.id!),
            })}
          >
            <div
              className={cn("rounded-sm px-2 py-2 text-white", {
                "bg-[#131720]": checkUser(message.senderId, user!.id!),
                "bg-[#2d3748]": !checkUser(message.senderId, user!.id!),
              })}
            >
              <p>{message.content}</p>
              <span className="text-[10px] text-gray-200">
                {format(message.createdAt, "HH:mm")}/{" "}
                {getDay(message.createdAt)}
                <br />
              </span>
            </div>
          </div>
        ))}

      <div ref={targetElement} className="invisible"></div>
    </section>
  );
}
