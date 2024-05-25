import React from "react";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth/auth";

export default function SignOut() {
  return (
    <div>
      <div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirect: false });
          }}
        >
          <Button variant="destructive" className="w-full">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
