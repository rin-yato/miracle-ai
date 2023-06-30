"use client";

import React from "react";

import { Input } from "../ui/input";
import { useHotkeys, useId } from "@mantine/hooks";
import { useChat } from "ai/react";

export function ChatInput() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const sessionId = useId();
  const { input, handleInputChange, handleSubmit } = useChat({
    id: "dreamslab",
    headers: {
      "api-key": "dreamslab",
    },
    body: {
      question: inputRef.current?.value,
      sessionId,
    },
  });

  const form = React.useRef<HTMLFormElement>(null);

  const kbd = React.useRef<HTMLDivElement>(null);

  useHotkeys([
    ["mod+enter", onModEnterAi],
    // ["enter", onModEnter],
  ]);

  // function onModEnter() {
  //   kbd.current?.setAttribute("data-active", "true");

  //   form.current?.submit();

  //   setTimeout(() => {
  //     kbd.current?.setAttribute("data-active", "false");
  //   }, 500);
  // }

  function onModEnterAi() {
    kbd.current?.setAttribute("data-active", "true");

    form.current?.submit();

    setTimeout(() => {
      kbd.current?.setAttribute("data-active", "false");
    }, 500);
  }

  function inputKeyListeners(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && e.metaKey) {
      onModEnterAi();
      return;
    }
    // if (e.key === "Enter" && !e.metaKey) onModEnter();
  }

  return (
    <div className="relative mr-1.5 mt-auto">
      <form onSubmit={handleSubmit} ref={form}>
        <Input
          value={input}
          ref={inputRef}
          onChange={handleInputChange}
          // onKeyDown={inputKeyListeners}
          placeholder="ask anything to the AI"
          className="pr-8"
        />
      </form>
      <kbd
        ref={kbd}
        className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 ring-sky-500 duration-500 data-[active='true']:scale-95 data-[active='true']:ring-1 sm:flex"
      >
        <span className="text-sm">⌘</span>
        <span className="-translate-y-0.5 text-sm">↵</span>
      </kbd>
    </div>
  );
}
