"use client";

import { useContext } from "react";

import { ChatOpenContext } from ".";
import { Separator } from "../ui/separator";
import { ChatHeader } from "./header";
import { ChatInput } from "./input";
import { ChatList } from "./list";
import { useClickOutside } from "@mantine/hooks";

export function ChatBox() {
  const { setIsChatOpen } = useContext(ChatOpenContext);
  const ref = useClickOutside(() => setIsChatOpen(false));
  return (
    <div
      ref={ref}
      className="flex max-h-[440px] w-96 flex-col rounded-xl border py-2 pl-2 pr-0.5"
    >
      <ChatHeader />
      <Separator className="mt-2" />
      <ChatList />
      <ChatInput />
    </div>
  );
}
