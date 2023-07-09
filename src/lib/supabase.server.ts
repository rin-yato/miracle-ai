import { cookies } from "next/headers";

import { DB } from "@/types/schema";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// initialize supabase
export const supabaseRouteHandler = createRouteHandlerClient<DB>({ cookies });

export async function getRouteHandlerUser() {
  // get current authenticated user
  const {
    data: { user },
  } = await supabaseRouteHandler.auth.getUser();

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function getRouteHandlerUserConfig() {
  // get current authenticated user
  const user = await getRouteHandlerUser();

  // get the user's config
  const { data } = await supabaseRouteHandler
    .from("configs")
    .select("*")
    .match({ user_id: user.id })
    .single();

  return data;
}
