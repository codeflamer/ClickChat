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
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

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
    <div className="flex flex-col justify-between h-screen ">
      <section className="flex-1 ">
        <p className="font-bold text-[20px] space-y-4">
          {session?.user?.email}{" "}
        </p>
        <div>
          <AcceptedFriends friends={friends} />
        </div>
        <Separator />
        <div>
          <RequestReceived receivedFriendRequests={receivedFriendRequests} />
        </div>
        <Separator />
        <div>
          <h2>Request Sent ({sentFriendRequests?.length}): </h2>
          <ul>
            {sentFriendRequests &&
              sentFriendRequests.map((friend) => (
                <li key={friend?.id}>
                  {friend?.name} ({friend?.email})
                </li>
              ))}
          </ul>
        </div>
        <Separator />
        <div className="mb-4">
          <h2>Request Declined...</h2>
          <ul>
            {declinedRequests?.length == 0 && <li>No Declined Requests</li>}
            {declinedRequests &&
              declinedRequests.map((friend) => (
                <li
                  key={friend?.id}
                  className="text-gray-500 cursor-not-allowed"
                >
                  {friend?.name} ({friend?.email})
                </li>
              ))}
          </ul>
        </div>

        <Button className="w-full">
          <Link href="/app" className="flex items-center">
            <PlusIcon /> Add
          </Link>
        </Button>
      </section>
      <div className="mt-2 w-full">
        <SignOut />
      </div>
    </div>
  );
}
