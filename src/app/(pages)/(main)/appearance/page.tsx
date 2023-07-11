"use client";

import React from "react";

import useConfig from "@/hooks/use-config";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Text from "@/components/ui/text";

import { Moon, Sun } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AppearancePage() {
  const { config, handleAvatarChange, isLoading, update, isValidating } =
    useConfig();
  const [theme, setTheme] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string>("");

  async function handleToggleTheme(newTheme: "light" | "dark") {
    let oldTheme = theme;
    setTheme(newTheme);
    toast.promise(update({ theme: newTheme }), {
      loading: "Saving...",
      success: "Theme updated!",
      error: () => {
        setTheme(oldTheme);
        return "Failed to update theme";
      },
    });
  }

  React.useEffect(() => {
    setTheme(config?.theme ?? theme);
    setName(config?.name ?? name);
  }, [config]);

  if (isLoading) return null;

  return (
    <main className="flex flex-1 flex-col p-8">
      <div className="max-w-lg">
        <Text variant="caption">Customize your ChatBot</Text>
        <Text className="mb-2 max-w-md text-gray-500">
          Settings that allows you to customize your chatbot&apos;s appearance.
          and also allows you to customize the chatbot&apos;s behavior.
        </Text>
      </div>
      <div className="mt-10 max-w-lg">
        <Text variant="caption" className="">
          Avatar
        </Text>
        <label
          htmlFor="avatar-input"
          className="group relative mt-3 flex aspect-square w-36 cursor-pointer "
        >
          <input
            type="file"
            id="avatar-input"
            hidden
            onChange={handleAvatarChange}
          />
          <Avatar className="h-full flex-1 rounded-lg">
            <AvatarImage
              src={config?.avatar || ""}
              alt="AI Avatar"
              className="h-full w-full"
            />
            <AvatarFallback className="rounded-lg">AI</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 opacity-0 duration-150 group-hover:opacity-100">
            <Text className="text-white" variant="caption">
              Change
            </Text>
          </div>
        </label>
      </div>
      <Separator className="mt-10 max-w-lg" />

      <div className="mt-10 max-w-sm">
        <Text variant="caption" className="mb-1.5">
          AI Name
        </Text>
        <div className="flex gap-2">
          <Input
            placeholder="what do you want the ai name to be?"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              toast.promise(update({ name }), {
                loading: "Saving...",
                success: "Name updated!",
                error: "Failed to update name",
              });
            }}
          >
            save
          </Button>
        </div>
      </div>
      {/* <div className="mt-10 max-w-sm">
        <Text variant="caption" className="mb-1.5">
          Theme
        </Text>
        <div className="flex flex-row gap-3">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="w-fit items-center gap-2"
            onClick={() => handleToggleTheme("light")}
          >
            <Sun size={16} />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="w-fit items-center gap-2"
            onClick={() => handleToggleTheme("dark")}
          >
            <Moon size={16} />
            Dark
          </Button>
        </div>
      </div> */}
    </main>
  );
}
