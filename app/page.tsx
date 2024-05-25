import SignOut from "@/components/sign-out";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="border-2 border-black text-center h-screen flex flex-col justify-center">
      <div className="border ">
        <h2 className="text-2xl font-bold"> Welcome to this chat App</h2>
        <div className="text-xl">Click here to start</div>
        {/* <div>Login</div> */}
        <div className="flex flex-col space-y-4 mt-3 uppercase">
          <Link href="/login">
            <Button>Login</Button>
          </Link>

          <Link href="/feed">
            <Button variant="secondary">Go to Feed</Button>
          </Link>

          <div>
            <SignOut />
          </div>
        </div>
      </div>
    </main>
  );
}
