import Messages from "@/components/messages";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import {
  getConversations,
  getPrivateChatId,
  getUserById,
} from "@/lib/database/queries";
import { GripHorizontal, Search } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const recipientId = params.id;

  const conversations = await getConversations(recipientId);
  const recipient = await getUserById(recipientId);
  const privateChatId = await getPrivateChatId(recipientId);

  console.log(session.user.image);

  return (
    <div className="relative flex h-screen max-h-screen flex-col overflow-hidden">
      <div className="mb-2 mt-2 flex items-center justify-between space-x-2 px-4 text-[20px] font-bold">
        <span>{recipient?.email}</span>
        <ul className="flex space-x-8">
          <li>
            <Search className="cursor-pointer" />
          </li>
          <li>
            <GripHorizontal className="cursor-pointer" />
          </li>
        </ul>
      </div>
      <Separator />
      <div>
        <Messages
          recipientId={recipientId}
          messages={conversations || []}
          user={session.user}
          privateChatId={privateChatId!}
          recepientImage={recipient!.image!}
        />
      </div>
    </div>
  );
}
