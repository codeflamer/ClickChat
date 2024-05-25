"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

type FriendNull = User | null;

type FriendType = {
  friends: FriendNull[] | undefined;
};

export default function AcceptedFriends({ friends }: FriendType) {
  const router = useRouter();
  return (
    <>
      <h2>Friends: </h2>
      <ul>
        <li>Friends ({friends?.length}): </li>
        {friends?.map((friend) => (
          <li
            key={friend?.id}
            onClick={() => router.push(`/app/chat/${friend?.id}`)}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            {friend?.email}
          </li>
        ))}
      </ul>
    </>
  );
}
