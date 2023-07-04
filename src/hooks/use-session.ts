import { useEffect, useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";

export default function useSession() {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getSession();
  }, []);

  async function getSession() {
    const _session = await supabase.auth.getSession();
    setSession(_session.data.session ?? null);
  }

  return { session };
}
