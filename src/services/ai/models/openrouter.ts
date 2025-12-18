import { env } from "@/data/env/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({
  apiKey: env.OPEN_ROUTER_API_KEY,
});
