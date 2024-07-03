import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const MessageSkeleton = ({ msgType }: { msgType: "sender" | "receiver" }) => {
  return (
    <div
      className={cn("flex cursor-wait space-y-3", {
        "flex-row-reverse": msgType == "sender",
        "flex-row": msgType == "receiver",
      })}
    >
      {/* Profile picture for recepient*/}

      {msgType == "receiver" && (
        <div className="ml-1 mr-2 flex items-end">
          <Skeleton className="h-[30px] w-[30px] rounded-full bg-[#0f172a]" />
        </div>
      )}

      {msgType !== "receiver" && (
        <div className="ml-1 mr-2 flex items-end">
          <Skeleton className="h-[30px] w-[30px] rounded-full bg-[#383e48]" />
        </div>
      )}

      <div
        className={cn("rounded-sm px-2 py-2 text-white", {
          "bg-[#383e48]": msgType == "receiver",
          "bg-[#131720]": msgType !== "receiver",
        })}
      >
        <p className="mt-2 space-y-2 text-[16px]">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-4 w-[100px]" />
        </p>
        <span className="mt-2 flex justify-between space-x-3 text-[10px] text-gray-200">
          <p>
            <Skeleton className="h-[10px] w-[20px] rounded-md" />
          </p>
          <p>
            <Skeleton className="h-[10px] w-[20px] rounded-md" />
          </p>
        </span>
      </div>
    </div>
  );
};

export default MessageSkeleton;
