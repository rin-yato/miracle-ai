import { DB, Table } from "@/types/schema";

import { getUser, supabaseClient } from "@/lib/supabase";

import { nanoid } from "nanoid";
import { toast } from "react-hot-toast";
import useSwr from "swr";

async function getUserConfig() {
  const user = await getUser();

  if (!user?.id) throw new Error("User not found");

  const { data } = await supabaseClient
    .from("configs")
    .select("*")
    .match({ user_id: user.id })
    .single();

  return data ?? undefined;
}

export default function useConfig() {
  const { data, ...swr } = useSwr("config", getUserConfig);

  async function update(values: Partial<Table<"configs", "single">>) {
    const user = await getUser();

    if (!user?.id) throw new Error("User not found");

    const { data: isExist } = await supabaseClient
      .from("configs")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!isExist) {
      await supabaseClient.from("configs").insert({
        ...values,
        user_id: user.id,
      });
    } else {
      await supabaseClient
        .from("configs")
        .update({
          ...values,
        })
        .eq("user_id", user.id)
        .single();
    }

    swr.mutate();
  }

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.item(0);

    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error(
        "Image size is too big, please upload an image less than 3mb"
      );
      return;
    }

    const promise = new Promise<string>(async (resolve, reject) => {
      const fileName = nanoid() + file.name;
      try {
        const { data, error } = await supabaseClient.storage
          .from("avatars")
          .upload(fileName, file);

        if (error) {
          reject(error.message);
        }

        if (data) {
          try {
            const filePath = supabaseClient.storage
              .from("avatars")
              .getPublicUrl(data.path);
            await update({ avatar: filePath.data.publicUrl });
          } catch (error) {
            reject("Error updating config");
          }
        }
      } catch (error) {
        reject("Error uploading avatar");
      }
      resolve("Avatar uploaded successfully");
    });

    await toast.promise(promise, {
      loading: "Uploading avatar...",
      success: "Avatar uploaded successfully",
      error: (err) => {
        return err;
      },
    });
  }

  return { config: data, ...swr, handleAvatarChange, update };
}
