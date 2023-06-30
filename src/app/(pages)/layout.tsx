import { cn } from "@/lib/utils";

import { Sidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

import "@/styles/global.css";

import { Inter } from "next/font/google";

import { Chat } from "@/components/chat";

import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Site",
  description: "Create an AI bot from just your website url in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "flex min-h-screen flex-col")}>
        <Toaster />
        <Chat />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <div className="flex flex-1">
            <Sidebar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
