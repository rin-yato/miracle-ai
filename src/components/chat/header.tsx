"use client";

import { useContext } from "react";

import { Table } from "@/types/schema";

import { ChatOpenContext } from ".";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Minus } from "lucide-react";

export function ChatHeader({
  config,
}: {
  config: Table<"configs", "single"> | undefined;
}) {
  const { setIsChatOpen } = useContext(ChatOpenContext);

  return (
    <div className="flex items-center pr-2">
      <Avatar className="cursor-pointer">
        <AvatarImage src={config?.avatar || ""} alt="AI Avatar" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <h3 className="ml-3 mr-auto cursor-pointer font-semibold hover:underline">
        {config?.name}
      </h3>
      <Button
        variant="ghost"
        className="aspect-square p-0"
        onClick={() => setIsChatOpen(false)}
      >
        <Minus />
      </Button>
    </div>
  );
}
