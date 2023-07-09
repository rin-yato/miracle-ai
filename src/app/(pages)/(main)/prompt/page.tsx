"use client";

import React from "react";

import useConfig from "@/hooks/use-config";

import Text from "@/components/ui/text";

import { AdvanceConfig } from "./components/advance-config";

export default function PromptPage() {
  const { config, update, isLoading } = useConfig();

  if (isLoading) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col p-6">
      <div className="max-w-sm">
        <Text variant="caption">Prompt Settings</Text>
        <Text className="text-gray-500">
          Customize your chatbot&apos;s responses, tone, and personality. The
          bot is yours!
        </Text>
      </div>
      <div className="mt-8 flex max-w-sm flex-col gap-y-8">
        <AdvanceConfig prompt={config?.prompt} noAnswer={config?.no_answer} />
      </div>
    </main>
  );
}
