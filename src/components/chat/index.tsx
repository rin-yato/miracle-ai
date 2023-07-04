"use client";

import { createContext, useState } from "react";

import { ChatBox } from "./box";
import { ChatTrigger } from "./trigger";
import { AnimatePresence, motion } from "framer-motion";

// create isChatOpen context
export const ChatOpenContext = createContext<{
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isChatOpen: false,
  setIsChatOpen: () => {},
});

export function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ChatOpenContext.Provider value={{ isChatOpen, setIsChatOpen }}>
      <motion.div layout className="fixed bottom-10 right-10 z-50">
        <AnimatePresence mode="wait">
          {!isChatOpen && (
            <motion.div
              layout
              exit={{
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.15,
              }}
              key="chat-trigger"
            >
              <ChatTrigger />
            </motion.div>
          )}
          {isChatOpen && (
            <motion.div
              layout
              key="chat-box"
              initial={{
                y: "100%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: "100%",
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <ChatBox />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ChatOpenContext.Provider>
  );
}
