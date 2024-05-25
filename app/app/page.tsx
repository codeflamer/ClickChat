import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import { addFriendToCurrentUser } from "@/lib/database/mutation";

import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <section className="space-y-3">
      <Separator />
      <div className="mt-3">
        <form action={addFriendToCurrentUser}>
          <label htmlFor="friendId">Add Friend email:</label>
          <input
            name="friendId"
            id="friendId"
            placeholder="Enter Friend's Email Address"
            className="border-2 border-black rounded-md py-2 px-2"
          />
          <div className="my-2" />
          <Button>Add Friend</Button>
        </form>
      </div>
      <Separator />
    </section>
  );
}
