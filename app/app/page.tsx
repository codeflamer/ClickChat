import AddFriendForm from "@/components/add-friend-form";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <section className="space-y-3">
      <Separator />
      <h2 className="text-center text-[20px] font-medium">
        Send Friend Request{" "}
      </h2>
      <div className="mt-3">
        <Suspense fallback={<>Loading...</>}>
          <AddFriendForm />
        </Suspense>
      </div>
      <Separator />
    </section>
  );
}
