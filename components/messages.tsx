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
import { getSignedUrl } from "@/lib/s3/actions";
import { computeSHA256 } from "@/lib/utils";
import { CircleX, Paperclip, SendHorizontal } from "lucide-react";
import {
  getSignatureServer,
  uploadPhotoContentDB,
} from "@/lib/cloudinary/actions";

type MessageType = {
  recipientId: string;
  messages: (Message & { messageId: MessageImage })[];
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
              compareAsc(a.createdAt, b.createdAt),
            ),
          );
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
        const cloud_name = "demo";

        // signature timestamp api_key
        const cloudinaryURl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
        if (!getSignature.success) return;

        const data = new FormData();
        data.append("file", file);
        data.append("timestamp", `${getSignature.success.timestamp}`);
        data.append("api_key", "411838697498383");
        data.append("upload_preset", "ml_default");

        const response = await fetch(cloudinaryURl, {
          method: "POST",
          body: data,
        });

        const responseData = await response.json();

        console.log(responseData);

        const photoData = {
          public_id: responseData.public_id,
          version: responseData.version,
          signature: responseData.signature,
          url: responseData.url,
        };

        content = messageRef.current?.value;
        if (!content) content = "";
        await uploadPhotoContentDB(photoData, content, recipientId);
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

  // const handleSubmitClick = async (e: any) => {
  //   e.preventDefault();
  //   try {
  //     let content;
  //     if (file) {
  //       const checkSum = await computeSHA256(file);
  //       const signedUrlResult = await getSignedUrl(
  //         file.type,
  //         file.size,
  //         checkSum,
  //         recipientId,
  //       );

  //       if (signedUrlResult.failure !== undefined) {
  //         console.error(signedUrlResult.failure);
  //         throw new Error(signedUrlResult.failure);
  //       }

  //       const url = signedUrlResult.success!.url;

  //       const messageId = signedUrlResult.success!.messageId;

  //       await fetch(url, {
  //         method: "PUT",
  //         body: file,
  //         headers: {
  //           "Content-Type": file.type,
  //         },
  //       });

  //       // const content = "this is the content";
  //       content = messageRef.current?.value;
  //       if (!content) return;
  //       const updatedMessage = await addMessageContent(content, messageId);
  //       if (updatedMessage?.failure !== undefined) {
  //         console.error("something went wrong");
  //         return;
  //       }
  //       console.log("message successfully sent");
  //     } else {
  //       content = messageRef.current?.value as string;
  //       const response = await addMessage(recipientId, content, privateChatId);
  //       if (response) {
  //         console.log("Message successfully sent");
  //         messageRef!.current!.value = "";
  //         targetElement?.current?.scrollIntoView({ behavior: "smooth" });
  //       }
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     return;
  //   } finally {
  //     setFile(undefined);
  //     setFileUrl(undefined);
  //   }
  // };

  return (
    <div>
      {/* {JSON.stringify(incomingMessages)} */}

      <MessageArea
        messages={messages}
        user={user}
        targetElement={targetElement}
        incomingMsgs={incomingMessages}
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

      <div className="absolute bottom-0 m-0 w-full rounded-md">
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
            className="h-7 w-full flex-1 rounded-md border-2 border-gray-300 px-3 py-6 focus:border-black focus:outline-none"
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
                className="mr-1 flex cursor-pointer items-center rounded-md border-0 bg-primary px-4 py-1 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Paperclip />
              </label>
              <Button
                type="submit"
                onClick={handleSubmitClick}
                className="h-full bg-green-400 text-white hover:bg-green-500"
              >
                <SendHorizontal />
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* <Button onClick={() => sendMessage()}>Test real time</Button> */}
    </div>
  );
}
