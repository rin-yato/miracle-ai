import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Chat } from "@/components/chat";
import { Sidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    redirect("/auth/login");
  }

  return (
    <React.Fragment>
      <Chat />
      <SiteHeader />
      <div className="flex flex-1">
        <Sidebar />
        {children}
      </div>
    </React.Fragment>
  );
}
