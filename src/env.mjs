import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    OPENAI_API_KEY: z.string(),
    SERPAPI: z.string(),
    PAWAN_KEY: z.string(),
  },
  client: {},
  runtimeEnv: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SERPAPI: process.env.SERPAPI,
    PAWAN_KEY: process.env.PAWAN_KEY,
  },
});
