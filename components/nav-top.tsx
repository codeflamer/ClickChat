import React from "react";

import { auth } from "@/lib/auth/auth";
import { inter, roboto_mono, dancing_script } from "@/app/font";
import Link from "next/link";
import { Button } from "./ui/button";
import SignOut from "./sign-out";

const Nav = async () => {
  const session = await auth();
  return (
    <section>
      <nav className="mx-auto flex max-w-screen-lg items-center justify-between pt-5">
        <div
          className={`cursor-pointer text-3xl font-bold ${dancing_script.className}`}
        >
          Click-Chat
        </div>
        <div>
          <Link href="/feed">
            <Button variant="link" className="text-[20px]">
              Posts
            </Button>
          </Link>
        </div>
        <div>
          {!session?.user?.id ? (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          ) : (
            <SignOut />
          )}
        </div>
      </nav>
    </section>
  );
};

export default Nav;
