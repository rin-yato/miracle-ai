"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { DynamicIcon, Icon } from "./icons";

type Config = {
  label: string;
  href: string;
  icon: Icon;
};
const CONFIG: Array<Config> = [
  { label: "Data", href: "/data", icon: "FileText" },
  { label: "Prompt", href: "/prompt", icon: "Dna" },
  { label: "Appearance", href: "/appearance", icon: "Contrast" },
  { label: "Docs", href: "/docs", icon: "BookMarked" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className={cn("w-60 border-r pb-12")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Importants
          </h2>
          <div className="space-y-1">
            {CONFIG.map((item) => (
              <Button
                asChild
                key={item.href}
                variant={pathname.endsWith(item.href) ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <DynamicIcon icon={item.icon} className="mr-2 h-4 w-4" />
                  {item.label}
                  <span className="sr-only">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
