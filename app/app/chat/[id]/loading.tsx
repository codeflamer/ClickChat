import MessageSkeleton from "@/components/skeleton-message";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GripHorizontal, Search } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.

  return (
    <section>
      <div className="grainy-dark relative flex h-screen max-h-screen flex-col overflow-hidden">
        <div className="mb-2 mt-2 flex items-center justify-between space-x-2 px-4 text-[20px] font-bold">
          <span className="cursor-wait">
            <Skeleton className="h-[30px] w-[200px] rounded-xl bg-[#0f172a]" />
          </span>
          <ul className="flex space-x-8">
            <li>
              <Skeleton className="h-[30px] w-[30px] rounded-xl bg-[#0f172a]" />
            </li>
            <li>
              <Skeleton className="h-[30px] w-[50px] rounded-xl bg-[#0f172a]" />
            </li>
          </ul>
        </div>
        <Separator className="shadow-lg" />

        <div className="mt-2">
          <div>
            {[...Array(2)]?.map((elem, key) => (
              <MessageSkeleton key={key} msgType="sender" />
            ))}
            {[...Array(3)]?.map((elem, key) => (
              <MessageSkeleton key={key} msgType="receiver" />
            ))}
            {[...Array(4)]?.map((elem, key) => (
              <MessageSkeleton key={key} msgType="sender" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
