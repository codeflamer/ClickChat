import AcceptedFriends from "./accepted-friends";

import RequestReceived from "./request-received";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import {
  getBlockedFriendRequestsId,
  getFriends,
  getReceivedFriendRequestsId,
  getSentFriendRequestsId,
  getUsesrByIds,
} from "@/lib/database/queries";
import SignOut from "./sign-out";
import Link from "next/link";
import { dancing_script } from "@/app/font";
import FriendsInfoHeader from "./friends-settings-title";
import { Ban, PlusIcon, Send } from "lucide-react";
import { Button } from "./ui/button";

export default async function SideBar() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const mySentRequestIds = await getSentFriendRequestsId();
  const myReceivedRequestIds = await getReceivedFriendRequestsId();
  const myBlockeddRequestIds = await getBlockedFriendRequestsId();

  const receivedFriendRequests = myReceivedRequestIds
    ? await getUsesrByIds(myReceivedRequestIds)
    : [];

  const sentFriendRequests = mySentRequestIds
    ? await getUsesrByIds(mySentRequestIds)
    : [];

  const declinedRequests = myBlockeddRequestIds
    ? await getUsesrByIds(myBlockeddRequestIds)
    : [];

  const friends = await getFriends();

  return (
    <div className="grainy-light flex h-screen flex-col justify-between p-2">
      <section className="flex-1">
        <div
          className={`cursor-pointer text-3xl font-bold ${dancing_script.className} `}
        >
          <Link href="/">Click-Chat</Link>
        </div>
        {/* Heading stops here */}
        <p className="mt-5 space-y-4 text-[20px] font-bold">
          {session?.user?.email}{" "}
        </p>
        {/* The Email of user */}
        <div className="mt-5" />
        <h5 className="text-[15px] font-bold text-[#7d7c7d]">
          #Friend Settings
        </h5>
        <div className="ml-4 mt-2 space-y-2 text-[16px]">
          <div className="cursor-pointer rounded-md px-1 py-2 hover:bg-[#e0e5e9]">
            <AcceptedFriends friends={friends} />
          </div>

          <div className="cursor-pointer rounded-md px-1 py-2 hover:bg-[#e0e5e9]">
            <RequestReceived receivedFriendRequests={receivedFriendRequests} />
          </div>

          <div className="cursor-pointer rounded-md px-1 py-2 hover:bg-[#e0e5e9]">
            <FriendsInfoHeader
              total={sentFriendRequests!.length}
              title="Sent requests"
              Icon={<Send className="h-5" />}
            />
            <ul>
              {sentFriendRequests &&
                sentFriendRequests.map((friend) => (
                  <li key={friend?.id}>
                    {friend?.name} ({friend?.email})
                  </li>
                ))}
            </ul>
          </div>

          <div className="cursor-pointer rounded-md px-1 py-2 hover:bg-[#e0e5e9]">
            <FriendsInfoHeader
              total={sentFriendRequests!.length}
              title="Request declined"
              Icon={<Ban className="h-5" />}
            />
            <ul className="ml-4">
              {/* {declinedRequests?.length == 0 && (
                <li className="text-[15px]">No Declined Requests</li>
              )} */}
              {declinedRequests &&
                declinedRequests.map((friend) => (
                  <li
                    key={friend?.id}
                    className="cursor-not-allowed text-gray-500"
                  >
                    {friend?.name} ({friend?.email})
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <Button className="mt-9 w-full">
          <Link href="/app" className="flex items-center">
            <PlusIcon /> Add friend
          </Link>
        </Button>
      </section>

      <div className="mb-2 mt-2 w-full">
        <SignOut />
      </div>
    </div>
  );
}
