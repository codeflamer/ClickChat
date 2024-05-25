import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await auth();
  //   console.log(session?.user?.email);
  if (!session) {
    redirect("/login");
  }

  return <div>page</div>;
}
