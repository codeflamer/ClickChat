"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../auth/auth";
import { db } from "../prisma/db";
import { z } from "zod";
import { getFriends } from "./queries";
import { pusherServer } from "../pusher/pusher";
import { v4 as uuidv4 } from "uuid";
import { AddFriendSchema } from "@/types";
import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
  handleReturnedServerError(e) {
    return "Oh no, something went wrong!";
  },
});

export const addFriendSafely = action(AddFriendSchema, async ({ email }) => {
  const session = await auth();
  if (!session?.user?.id) return;

  if (!email) return { error: "email cannot be empty" };

  const friendEmail = email;

  const userId = session.user?.id as string;
  // to verify if the added user exists
  const friend = await db.user.findUnique({
    where: {
      email: friendEmail,
    },
  });
  const friendId = friend?.id; //if friend esists we get the friendID
  if (!friendId) return { error: `User with ${email} does not exist` };
  if (friendId == userId) return { error: "You can't add yourself" };

  console.log("Friend Found");

  const friendLists = await getFriends();
  console.log(friendLists);

  //for a more robust check , make it check against user not in the with STATUS PCCEPTED AND PENDING
  //check against already added friends
  if (friendLists?.length) {
    for (let i = 0; i < friendLists!.length; i++) {
      console.log(friend?.id);
      console.log(friendLists[i]!.id);
      if (friend?.id == friendLists[i]!.id) {
        return { error: "Friend Request Already Sent" };
      }
    }
  }

  try {
    const createResponse = await db.friend.create({
      data: {
        userId,
        friendId,
      },
    });
    return { success: `Friend request sent to ${friendEmail}` };
  } catch (error) {
    // return new Response(null, { status: 500 });
    console.log("An error occured", error);
    return { error: "Something Happened , couldnt sent friend request" };
  }

  // revalidatePath("/app");
});

const createPrivateChat = async (friendId: string) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!friendId) return;

  try {
    await db.privateChat.create({
      data: {
        user1Id: session.user.id,
        user2Id: friendId,
      },
    });
  } catch (error) {
    console.log("An error occured", error);
    return { error: "Somewthing went wrong" };
  }
};

export const acceptFriendRequest = async (friendId: string | undefined) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!friendId) return;

  try {
    const response = await db.friend.update({
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
    if (response) {
      await createPrivateChat(friendId);
      revalidatePath("/app");
      return { success: "Request Accepted" };
    }
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

export const addMessage = async (
  recipientId: string,
  content: string,
  privateChatId: string,
) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!recipientId) return;

  const validationData = AddMessageSchema.safeParse({
    content,
  });
  if (!validationData.success) return;
  // const privateChatId = "the-private-room";
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

export const createMessageImage = async (
  url: string,
  recipientId: string,
  content: string,
) => {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        recepientId: recipientId,
        content: content,
      },
    });
    const ImageMessage = await db.messageImage.create({
      data: {
        imageUrl: url,
        senderId: session.user.id,
        messageId: message.id,
      },
    });
    return { imageMessage: ImageMessage, message: message };
  } catch (error) {
    console.error(error);
  }
};

export const addMessageContent = async (content: string, messageId: string) => {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const updatedMessage = await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        content: content,
      },
    });
    return { success: updatedMessage };
  } catch (error) {
    console.log(error);
    return { failure: "Something went wrong" };
  }
};
