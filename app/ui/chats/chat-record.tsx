"use client";

import { CheckIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";

export const ChatRecord = ({ chat }) => {
  // const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setQueryString() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("chatId", chat.chatId);
    return params.toString();
  }

  return (
    <Link
      className="w-full px-1 py-2"
      key={chat?.chatId}
      href={pathname + "?" + setQueryString()}
    >
      <Card className="hover:opacity-80">
        <CardHeader>
          <CardTitle>{chat?.chatId}</CardTitle>
          <CardDescription>{new Date().toDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-flow-col justify-between">
            <span>aswef</span>
            <ChatStatusIcon status="read" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ChatStatusIcon = ({ status }) => {
  if (status == "read") {
    return (
      <div>
        <ShieldCheckIcon className="size-6" />
      </div>
    );
  } else if (status == "delivered") {
    return (
      <div>
        <CheckIcon className="size-6" />
      </div>
    );
  }
};
