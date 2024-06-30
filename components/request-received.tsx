"use client";

import { User } from "@prisma/client";
import React from "react";
import { Button } from "./ui/button";
import {
  DeclineFriendRequest,
  acceptFriendRequest,
} from "@/lib/database/mutation";
import FriendsInfoHeader from "./friends-settings-title";
import { HandCoins } from "lucide-react";

type NullabeUser = User | null;

type ReceivedFriendRequest = {
  receivedFriendRequests: NullabeUser[] | undefined;
};

export default function RequestReceived({
  receivedFriendRequests,
}: ReceivedFriendRequest) {
  //Leave space here
  const handleAccept = async (friendId: string) => {
    if (!friendId) return;
    const res = await acceptFriendRequest(friendId);
    console.log(res?.success);
    alert(res?.success);
  };

  const handleDecline = async (friendId: string) => {
    if (!friendId) return;
    const res = await DeclineFriendRequest(friendId);
    console.log(res?.success);
    alert(res?.success);
  };

  if (receivedFriendRequests)
    return (
      <>
        <FriendsInfoHeader
          total={receivedFriendRequests!.length}
          title="Friend requests"
          Icon={<HandCoins />}
        />
        <ul>
          {receivedFriendRequests
            ? receivedFriendRequests.map((friend) => (
                <li key={friend?.id}>
                  {friend?.name}({friend?.email}){" "}
                  <Button
                    variant="outline"
                    onClick={() => handleAccept(friend?.id as string)}
                  >
                    Accept
                  </Button>{" "}
                  |{" "}
                  <Button
                    variant="destructive"
                    onClick={() => handleDecline(friend?.id as string)}
                  >
                    Decline
                  </Button>
                </li>
              ))
            : "No received request"}
        </ul>
      </>
    );
}
