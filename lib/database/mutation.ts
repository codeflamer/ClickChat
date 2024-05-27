"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../auth/auth";
import { db } from "../prisma/db";
import { z } from "zod";
import { getFriends } from "./queries";
import { User } from "@prisma/client";
import { pusherServer } from "../pusher/pusher";
import { v4 as uuidv4 } from "uuid";

const AddFriendSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid Email",
    })
    .email(),
});

export type State = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export const addFriendToCurrentUser = async (
  prevState: State,
  val: FormData
) => {
  const session = await auth();
  if (!session?.user?.id) return;

  const friendEmail = val.get("friendId") as string;

  const validationData = AddFriendSchema.safeParse({
    email: friendEmail,
  });

  if (!validationData.success) {
    return {
      errors: validationData.error.flatten().fieldErrors,
      message: "Please enter a valid email",
    };
  }

  const userId = session.user?.id as string;
  const friend = await db.user.findUnique({
    where: {
      email: friendEmail,
    },
  });
  //   console.log(friend);
  const friendId = friend?.id;
  if (!friendId) return;

  try {
    //check agains already added friends
    // const friendLists = await getFriends();
    // friendLists?.forEach((friend) => {
    //   if (friend?.id == friendId) {
    //     return {
    //       errors: {},
    //       message: "Already Added Friends",
    //     };
    //   }
    // });

    // for (let i = 0; i < friendLists!.length; i++) {
    //   if (friend?.id == friendId[i]) {
    //     throw new Error("User already Exists");
    //   }
    // }
    // for(friend of friendLists) {

    // }

    //check against adding self
    // Nextup

    await db.friend.create({
      data: {
        userId,
        friendId,
      },
    });
    console.log("End here");
  } catch (error) {
    // return new Response(null, { status: 500 });
    console.log("An error occured", error);
    return {
      message: "Something went wrong, Couldnt add friend",
    };
  }

  revalidatePath("/app");
};

export const acceptFriendRequest = async (friendId: string | undefined) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!friendId) return;

  try {
    await db.friend.update({
      where: {
        userId_friendId: {
          friendId: session.user.id,
          userId: friendId,
        },
      },
      data: {
        status: "ACCEPTED",
      },
    });
    revalidatePath("/app");
    return { success: "Request Accepted" };
  } catch (error) {
    console.log("An error occured", error);
    return { error: "Somewthing went wrong" };
  }
};

export const DeclineFriendRequest = async (friendId: string | undefined) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!friendId) return;

  try {
    await db.friend.update({
      where: {
        userId_friendId: {
          friendId: session.user.id,
          userId: friendId,
        },
      },
      data: {
        status: "BLOCKED",
      },
    });
    revalidatePath("/app");
    return { success: "Request Declined" };
  } catch (error) {
    console.log("An error occured", error);
    return { error: "Somewthing went wrong" };
  }
};

const AddMessageSchema = z.object({
  content: z.string(),
});

export const addMessage = async (recipientId: string, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!recipientId) return;
  const content = formData.get("content") as string;
  const validationData = AddMessageSchema.safeParse({
    content,
  });
  if (!validationData.success) return;
  const privateChatId = "the-private-room";
  const senderId = session.user.id;
  pusherServer.trigger(privateChatId, "incoming-messages", {
    senderId,
    recipientId,
    content,
    id: uuidv4(),
  });

  try {
    const newMessage = await db.message.create({
      data: {
        senderId: session.user.id,
        recepientId: recipientId,
        content: content,
      },
    });
    // revalidatePath(`/app/${recipientId}`);
    // console.log(newMessage);
    // return { success: "Request Declined" };
    return newMessage;
  } catch (error) {
    console.log("An error occured", error);
    return { error: "Somewthing went wrong,cound not send message" };
  }
};
