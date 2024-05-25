import { checkUser, cn, getDay } from "@/lib/utils";
import { Message } from "@prisma/client";
import { format } from "date-fns";
import { User } from "next-auth";
import React, { useEffect } from "react";

export default function MessageArea({
  messages,
  user,
  targetElement,
}: {
  messages: Message[];
  user: User;
  targetElement: React.RefObject<HTMLDivElement>;
}) {
  useEffect(() => {
    targetElement?.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="flex-1 space-y-1 mt-2 px-1  overflow-y-scroll"
      style={{ height: "calc(100vh - 80px)" }}
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
            className={cn("rounded-sm px-2 py-2  text-white", {
              "bg-[#131720]": checkUser(message.senderId, user!.id!),
              "bg-[#2d3748]": !checkUser(message.senderId, user!.id!),
            })}
          >
            <p>{message.content}</p>
            <span className="text-gray-200 text-[10px]">
              {format(message.createdAt, "HH:mm")}/ {getDay(message.createdAt)}
              <br />
            </span>
          </div>
        </div>
      ))}
      <div ref={targetElement} className="invisible"></div>
    </section>
  );
}
