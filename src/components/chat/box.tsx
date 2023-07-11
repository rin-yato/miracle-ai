"use client";

import { useContext } from "react";

import useConfig from "@/hooks/use-config";
import useSession from "@/hooks/use-session";

import { ChatOpenContext } from ".";
import { Separator } from "../ui/separator";
import { ChatHeader } from "./header";
import { ChatInput } from "./input";
import { ChatList } from "./list";
import { useClickOutside } from "@mantine/hooks";

export function ChatBox() {
  const { setIsChatOpen } = useContext(ChatOpenContext);
  // const ref = useClickOutside(() => setIsChatOpen(false));
  const { session } = useSession();
  const { config } = useConfig();

  if (!session?.user.id) return null;

  return (
    <div
      // ref={ref}
      className="z-50 flex max-h-[550px] w-96 flex-col rounded-xl border bg-white py-2 pl-2 pr-0.5 dark:bg-black"
    >
      <ChatHeader config={config} />
      <Separator className="mt-2" />
      <ChatList />
      <ChatInput
        noAnswer={config?.no_answer}
        prompt={config?.prompt}
        userId={session?.user.id}
      />
    </div>
  );
}
