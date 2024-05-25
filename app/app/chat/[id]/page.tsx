import Messages from "@/components/messages";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import { getConversations, getUserById } from "@/lib/database/queries";
import { checkUser, cn, getDay } from "@/lib/utils";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const recipientId = params.id;

  const conversations = await getConversations(recipientId);
  const recipient = await getUserById(recipientId);

  return (
    <div className="flex flex-col justify-between h-screen border px-1">
      <div className="text-center">
        This is the chat page: Me ---- {recipient?.email}
        <Separator />
      </div>

      <div>
        <Messages
          recipientId={recipientId}
          messages={conversations || []}
          user={session.user}
        />
      </div>
    </div>
  );
}
