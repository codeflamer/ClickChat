"use client";

import { User } from "@prisma/client";
import { Handshake } from "lucide-react";
import { useRouter } from "next/navigation";
import FriendsInfoHeader from "./friends-settings-title";

type FriendNull = User | null;

type FriendType = {
  friends: FriendNull[] | undefined;
};

export default function AcceptedFriends({ friends }: FriendType) {
  const router = useRouter();
  return (
    <div className="cursor-pointer">
      <FriendsInfoHeader
        total={friends!.length}
        title="Friends"
        Icon={<Handshake className="h-5" />}
      />

      <ul className="ml-4 mt-2 space-y-1">
        {friends?.map((friend) => (
          <li
            key={friend?.id}
            onClick={() => router.push(`/app/chat/${friend?.id}`)}
            className="cursor-pointer rounded-md px-2 py-1 text-[15px] hover:bg-[#dbccea]"
          >
            {friend?.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
