import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function getUser() {
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
