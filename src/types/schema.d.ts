import { Database } from "./supabase";

export type Table<
  T extends keyof Database["public"]["Tables"],
  K extends "single" | "array" = "array"
> = K extends "single"
  ? Database["public"]["Tables"][T]["Row"]
  : Array<Database["public"]["Tables"][T]["Row"]>;

export type DB = Database;

// make all fields not nullable
export type NotNullable<T> = {
  [P in keyof T]-?: Exclude<T[P], null>;
};
