import { createAuthClient } from "better-auth/react";
import { multiSessionClient } from "better-auth/client/plugins";
import { siwxClient } from "./siws/siwx-client";
import { env } from "../env";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_APP_URL,
	plugins: [multiSessionClient(), siwxClient()],
});
