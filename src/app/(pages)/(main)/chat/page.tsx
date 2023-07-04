"use client";

import React, { useId } from "react";

import { useChat } from "ai/react";

export default function Chat() {
  const chatSessionId = useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    headers: {
      "chat-id": "dreamslab",
    },
    body: {
      question: inputRef.current?.value,
      chatSessionId,
    },
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <label>
          <input
            ref={inputRef}
            className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
            value={input}
            onChange={handleInputChange}
          />
        </label>
      </form>
    </div>
  );
}



