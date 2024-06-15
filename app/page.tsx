import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import Nav from "@/components/nav-top";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Send } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-screen-2xl px-5 md:px-20">
        <Nav />
        {/* for Banner */}
        <section className="mt-[70px]">
          <div className="grid rounded-2xl bg-[#dae3f0] px-8 py-2 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-3 md:space-y-5">
              <p className="text-[14px] font-bold uppercase text-[#848c97] md:text-[20px]">
                Connect Instantly, Communicate endelessly
              </p>
              <h2 className="text-[40px] font-bold leading-[50px] text-[#31313c] md:text-[70px] md:leading-[70px]">
                We Make Chatting Simple
              </h2>
              <p className="mt-3 text-[14px] uppercase text-[#848c97] md:text-[18px]">
                Experience the ultimate user-friendly chat app
              </p>
              <Link href="/app">
                <Button className="w-[210px]" variant="secondary">
                  Continue Chat <Send className="ml-2" />
                </Button>
              </Link>
              {/* by @codeflamer */}
            </div>
            <div className="relative hidden md:grid">
              <Image
                src="/images/image1.jpg"
                title="Lady texting on phone"
                className="h-[80vh] w-full rounded-full object-cover"
                alt="Lady-texting"
                width={500}
                height={500}
              />
              <div className="absolute bottom-1/4 flex max-w-[230px] cursor-pointer items-center space-x-2 rounded-md bg-white/90 px-2 py-2 shadow-md backdrop-blur-sm">
                <Avatar>
                  <AvatarImage src="/testimonies/user-1.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-[15px] font-semibold">Richard Donald</h4>
                  <p className="text-[13px] text-gray-500">
                    The best chatting app I have ever used.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3/4 right-0 flex max-w-[250px] cursor-pointer items-center space-x-2 rounded-md bg-white/90 px-2 py-2 shadow-md backdrop-blur-sm">
                <Avatar>
                  <AvatarImage src="/testimonies/user-2.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-[15px] font-semibold">Richard Donald</h4>
                  <p className="text-[13px] text-gray-500">
                    The is an epitome of communication made seamless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
