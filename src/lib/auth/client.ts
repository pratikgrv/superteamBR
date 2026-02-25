import { multiSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "../env";
import { siwxClient } from "./siws/siwx-client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [multiSessionClient(), siwxClient()],
});
