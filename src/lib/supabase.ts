import { DB } from "@/types/schema";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabaseClient = createClientComponentClient<DB>();

export async function getUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  return user;
}
