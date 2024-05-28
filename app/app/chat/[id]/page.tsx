import Messages from "@/components/messages";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import {
  getConversations,
  getPrivateChatId,
  getUserById,
} from "@/lib/database/queries";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const recipientId = params.id;

  const conversations = await getConversations(recipientId);
  const recipient = await getUserById(recipientId);
  const privateChatId = await getPrivateChatId(recipientId);

  return (
    <div className="flex flex-col h-screen border max-h-screen relative overflow-hidden">
      <div className="text-center font-bold text-[20px]">
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
