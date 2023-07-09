import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSwr from "swr";

async function getSession() {
  const supabase = createClientComponentClient();
  const _session = await supabase.auth.getSession();
  return _session.data.session ?? undefined;
}

export default function useSession() {
  const { data: session } = useSwr("session", getSession);

  return { session };
}
