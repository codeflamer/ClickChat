"use server";

import { unstable_noStore as noStore } from "next/cache";

import { auth } from "../auth/auth";
import { db } from "../prisma/db";
import { Friend } from "@prisma/client";
import { compareAsc, compareDesc } from "date-fns";

export const getSentFriendRequestsId = async () => {
  noStore();
  const session = await auth();
  if (!session?.user) return;

  try {
    const SentRequests = await db.friend.findMany({
      where: {
        userId: session.user?.id,
        status: "PENDING",
      },
    });
    const requestIds = SentRequests.map((friend) => {
      return friend.friendId;
    });
    return requestIds;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

export const getReceivedFriendRequestsId = async () => {
  noStore();
  const session = await auth();
  if (!session?.user) return;

  try {
    const receivedRequests = await db.friend.findMany({
      where: {
        friendId: session.user?.id,
        status: "PENDING",
      },
    });
    const requestIds = receivedRequests.map((friend) => {
      return friend.userId;
    });
    return requestIds;
  } catch (error) {
    console.log("An error occurred", error);
    // return { error: "Something went wrong" };
  }
};

export const getBlockedFriendRequestsId = async () => {
  noStore();
  const session = await auth();
  if (!session?.user) return;
  try {
    const receivedRequests = await db.friend.findMany({
      where: {
        friendId: session.user?.id,
        status: "BLOCKED",
      },
    });
    const requestIds = receivedRequests.map((friend) => {
      return friend.userId;
    });
    return requestIds;
  } catch (error) {
    console.log("An error occurred", error);
    // return { error: "Something went wrong" };
  }
};

export const getUserById = async (id: string) => {
  noStore();
  const session = await auth();
  if (!session?.user) return;

  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

export const getUsesrByIds = async (ids: string[] | undefined) => {
  noStore();
  const session = await auth();
  if (!session?.user) return;
  if (ids)
    try {
      const queries = [];
      for (const id of ids) {
        queries.push(db.user.findUnique({ where: { id: id } }));
      }
      const results = await Promise.all(queries);
      return results;
    } catch (error) {
      console.log("An error occurred", error);
    }
};

export const getFriends = async () => {
  noStore();
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const AllFriends: Friend[] = [];
    const queries = [];
    const userFriends = db.friend.findMany({
      where: {
        userId: session.user?.id,
        status: "ACCEPTED",
      },
    });
    const userFriendsOf = db.friend.findMany({
      where: {
        friendId: session.user?.id,
        status: "ACCEPTED",
      },
    });
    queries.push(userFriends);
    queries.push(userFriendsOf);
    const Friends = await Promise.all(queries);

    AllFriends.push(...Friends[0], ...Friends[1]);

    const AllUserIds = AllFriends.map((user) => {
      if (user.userId === session?.user?.id) {
        return user.friendId;
      }
      if (user.friendId === session?.user?.id) {
        return user.userId;
      }
    });
    const FetchedFriend = await getUsesrByIds(AllUserIds as string[]);
    return FetchedFriend;
  } catch (error) {
    console.log("An error occurred", error);
    // return { error: "Something went wrong" };
  }
};

export const getConversations = async (recepientId: string) => {
  noStore();
  const session = await auth();
  if (!session?.user?.id) return;
  if (!recepientId) return;

  try {
    const messageQueries = [];
    const msgFromUser = db.message.findMany({
      where: {
        senderId: session.user.id,
        recepientId,
      },
    });

    const msgFromRecipient = db.message.findMany({
      where: {
        senderId: recepientId,
        recepientId: session.user.id,
      },
    });

    messageQueries.push(msgFromUser, msgFromRecipient);

    const [messagesByUser, messagesFromRecipient] = await Promise.all(
      messageQueries
    );
    const messages = [...messagesByUser, ...messagesFromRecipient].sort();
    messages.sort((a, b) => compareAsc(a.createdAt, b.createdAt));
    // console.log(messages);
    return messages;
  } catch (error) {
    console.log("An error occurred", error);
  }
  console.log(recepientId);
};

export const getPrivateChatId = async (recepientId: string) => {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!recepientId) return;

  try {
    const privateChatQueries = [];
    const chatId1 = db.privateChat.findMany({
      where: {
        user1Id: session.user.id,
        user2Id: recepientId,
      },
    });

    const chatId2 = db.privateChat.findMany({
      where: {
        user1Id: recepientId,
        user2Id: session.user.id,
      },
    });

    privateChatQueries.push(chatId1, chatId2);

    const [privateChat1, privateChat2] = await Promise.all(privateChatQueries);

    const privateChat = [...privateChat1, ...privateChat2];
    // console.log(privateChat);
    return privateChat[0].id;
  } catch (error) {
    console.log("An error occurred", error);
  }
};
