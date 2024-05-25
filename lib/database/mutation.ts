"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../auth/auth";
import { db } from "../prisma/db";

export const addFriendToCurrentUser = async (val: FormData) => {
  const session = await auth();
  if (!session) return;
  const friendEmail = val.get("friendId") as string;
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
    await db.friend.create({
      data: {
        userId,
        friendId,
      },
    });
  } catch (error) {
    // return new Response(null, { status: 500 });
    console.log("An error occured", error);
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

export const addMessage = async (recipientId: string, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!recipientId) return;
  const content = formData.get("content") as string;
  try {
    await db.message.create({
      data: {
        senderId: session.user.id,
        recepientId: recipientId,
        content: content,
      },
    });
    revalidatePath(`/app/${recipientId}`);
    return { success: "Request Declined" };
  } catch (error) {
    console.log("An error occured", error);
    return { error: "Somewthing went wrong,cound not send message" };
  }
};
