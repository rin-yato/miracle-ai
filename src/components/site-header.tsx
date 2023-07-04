import React from "react";
import { cookies } from "next/headers";

import { Icons } from "./icons";
import { ProfileDropdown } from "./profile-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Text from "./ui/text";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b px-5 py-1 lg:px-10 lg:py-3">
      <span className="flex items-center space-x-1">
        <Icons.Atom className="h-7 w-7" />
        <Text variant="smallheading" className="font-black tracking-tighter">
          AI SITE
        </Text>
      </span>
      <nav className="flex space-x-5">
        <ThemeToggle />
        <ProfileDropdown />
      </nav>
    </header>
  );
}
