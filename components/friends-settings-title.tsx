import { Handshake } from "lucide-react";
import React from "react";

const FriendsInfoHeader = ({
  total,
  title,
  Icon,
}: {
  total: number;
  title: string;
  Icon: any;
}) => {
  return (
    <>
      <h2 className="flex items-center space-x-1">
        {/* <Handshake className="h-5" /> */}
        {Icon}
        <span className="font-bold">
          {title}({total})
        </span>
      </h2>
    </>
  );
};

export default FriendsInfoHeader;
