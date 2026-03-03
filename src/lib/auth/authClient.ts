import { env } from "@/env";
import { adminClient, multiSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { siwsClient } from "./siws/client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL as string,
  plugins: [multiSessionClient(), adminClient(), siwsClient()],
});
