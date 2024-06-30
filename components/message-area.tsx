import { questrial } from "@/app/font";
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
  recepientImage,
}: {
  messages: (Message & { messageId: MessageImage })[];
  user: User;
  targetElement: React.RefObject<HTMLDivElement>;
  incomingMsgs: (Message & { messageId: MessageImage })[];
  recepientImage: string;
}) {
  useEffect(() => {
    targetElement?.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className={`${questrial.className} mt-2 flex-1 space-y-1 overflow-y-scroll px-1`}
      style={{ height: "calc(100vh - 110px)" }}
      // initially 80px
    >
      {/* Normal Message */}
      {messages?.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "flex-row-reverse": checkUser(message.senderId, user!.id!),
            "flex-row": !checkUser(message.senderId, user.id!),
          })}
        >
          {/* Image for recepient picture */}
          {!checkUser(message.senderId, user.id!) && (
            <div className="mr-2 flex items-end">
              <Image
                src={recepientImage}
                width={35}
                height={35}
                alt="profile pix"
                className="h-[35px] w-[35px] rounded-full hover:cursor-pointer"
              />
            </div>
          )}

          {/* Image for sender picture */}
          {checkUser(message.senderId, user.id!) && (
            <div className="ml-2 flex items-end">
              <Image
                src={user.image!}
                width={35}
                height={35}
                alt="profile pix"
                className="h-[35px] w-[35px] rounded-full border hover:cursor-pointer"
              />
            </div>
          )}

          <div
            className={cn("rounded-sm px-2 py-2 text-white", {
              "bg-[#131720]": checkUser(message.senderId, user!.id!),
              "bg-[#383e48]": !checkUser(message.senderId, user!.id!),
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
                  width={600}
                  height={600}
                  objectFit="cover"
                  quality={100}
                  className="h-[200px] w-full max-w-[300px] rounded-sm"
                  loading="lazy"
                />
              </a>
            )}
            <p className="mt-2 text-[16px]">{message.content}</p>
            <span className="mt-2 flex justify-between space-x-3 text-[10px] text-gray-200">
              <p>{format(message.createdAt, "HH:mm")}</p>{" "}
              <p>{getDay(message.createdAt)} </p>
            </span>
          </div>
        </div>
      ))}
      {/* for incoming messages */}

      {incomingMsgs.length > 0 &&
        incomingMsgs?.map((message: Message & { messageId?: MessageImage }) => (
          <div
            key={message.id}
            className={cn("flex", {
              "flex-row-reverse": checkUser(message.senderId, user!.id!),
              "flex-row": !checkUser(message.senderId, user.id!),
            })}
          >
            {/* Image for recepient picture */}
            {!checkUser(message.senderId, user.id!) && (
              <div className="mr-2 flex items-end">
                <Image
                  src={recepientImage}
                  width={35}
                  height={35}
                  alt="profile pix"
                  className="h-[35px] w-[35px] rounded-full hover:cursor-pointer"
                />
              </div>
            )}

            {/* Image for sender picture */}
            {checkUser(message.senderId, user.id!) && (
              <div className="ml-2 flex items-end">
                <Image
                  src={user.image!}
                  width={35}
                  height={35}
                  alt="profile pix"
                  className="h-[35px] w-[35px] rounded-full border hover:cursor-pointer"
                />
              </div>
            )}
            <div
              className={cn("rounded-sm px-2 py-2 text-white", {
                "bg-[#131720]": checkUser(message.senderId, user!.id!),
                "bg-[#2d3748]": !checkUser(message.senderId, user!.id!),
              })}
            >
              {message.messageId && (
                <a
                  href={message.messageId.imageUrl}
                  target="_blank"
                  title="media_link"
                >
                  <Image
                    src={message.messageId.imageUrl}
                    alt={message.id}
                    width={100}
                    height={100}
                    objectFit="cover"
                    className="h-[200px] w-full max-w-[300px] rounded-sm"
                  />
                </a>
              )}
              <p className="mt-2 text-[16px]">{message.content}</p>
              <span className="mt-2 flex justify-between space-x-3 text-[10px] text-gray-200">
                <p>{format(message.createdAt, "HH:mm")}</p>{" "}
                <p>{getDay(message.createdAt)} </p>
              </span>
            </div>
          </div>
        ))}

      <div ref={targetElement} className="invisible"></div>
    </section>
  );
}
