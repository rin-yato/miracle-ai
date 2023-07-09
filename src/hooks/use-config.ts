import { DB } from "@/types/schema";

import { getUser } from "@/lib/supabase";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSwr from "swr";
import { z } from "zod";

const supabase = createClientComponentClient<DB>();

async function getUserConfig() {
  const user = await getUser();

  if (!user?.id) throw new Error("User not found");

  const { data } = await supabase
    .from("configs")
    .select("*")
    .match({ user_id: user.id })
    .single();

  return data ?? undefined;
}

const updateSchema = z.object({
  prompt: z.string().nullable().optional(),
  noAnswer: z.string().nullable().optional(),
});

export default function useConfig() {
  const { data, ...swr } = useSwr("config", getUserConfig);

  async function update(values: z.infer<typeof updateSchema>) {
    const { noAnswer, prompt } = updateSchema.parse(values);
    const user = await getUser();

    if (!user?.id) throw new Error("User not found");

    const { data: isExist } = await supabase
      .from("configs")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!isExist) {
      await supabase.from("configs").insert({
        prompt,
        no_answer: noAnswer,
        user_id: user.id,
      });
    } else {
      await supabase
        .from("configs")
        .update({
          prompt,
          no_answer: noAnswer,
        })
        .eq("user_id", user.id)
        .single();
    }

    swr.mutate();
  }

  return { config: data, ...swr, update };
}
