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
    <section className="h-screen space-y-3">
      <Separator />
      <h2 className="text-center text-[20px] font-medium">
        Send Friend Request{" "}
      </h2>
      <div className="mx-auto flex h-3/4 items-center justify-center md:items-start md:justify-start">
        <Suspense fallback={<>Loading...</>}>
          <AddFriendForm />
        </Suspense>
      </div>
    </section>
  );
}
