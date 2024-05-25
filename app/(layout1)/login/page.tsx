import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth/auth";
import React from "react";

export default function Page() {
  return (
    <div className="p-2">
      <div className="mt-3">
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/app" });
          }}
        >
          <Button variant="secondary">Login With GitHub</Button>
        </form>
        <Separator />
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/app" });
          }}
        >
          <Button variant="secondary">Login With Google</Button>
        </form>
      </div>
    </div>
  );
}
