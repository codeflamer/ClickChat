import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth/auth";
import { Github } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <div className="mt-10">
      <h1 className="text-center text-[25px] font-semibold">Sign In</h1>
      <div className="mx-auto mt-10 flex max-w-lg flex-col space-y-4">
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/app" });
          }}
          className=""
        >
          <Button
            variant="default"
            className="py- w-full flex-grow space-x-2"
            size="custom"
          >
            <Github className="mr-2" /> Login With GitHub
          </Button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/app" });
          }}
        >
          <Button
            variant="secondary"
            className="w-full space-x-2"
            size="custom"
          >
            Login With Google
          </Button>
        </form>
      </div>
    </div>
  );
}
