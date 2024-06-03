import Messages from "@/components/messages";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import {
  getConversations,
  getPrivateChatId,
  getUserById,
} from "@/lib/database/queries";
import { Message, MessageImage } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const recipientId = params.id;

  const conversations = await getConversations(recipientId);
  const recipient = await getUserById(recipientId);
  const privateChatId = await getPrivateChatId(recipientId);

  return (
    <div className="relative flex h-screen max-h-screen flex-col overflow-hidden border">
      <div className="text-center text-[20px] font-bold">
        This is the chat page: Me & {recipient?.email}
        <Separator />
      </div>
      <div>
        <Messages
          recipientId={recipientId}
          messages={conversations || []}
          user={session.user}
          privateChatId={privateChatId!}
        />
      </div>
    </div>
  );
}
