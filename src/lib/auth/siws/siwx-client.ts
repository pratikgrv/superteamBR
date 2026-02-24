import type { BetterAuthClientPlugin } from "better-auth";
import { siwx } from "./siwx";

export const siwxClient = () =>
	({
		id: "siwx",
		$InferServerPlugin: {} as ReturnType<typeof siwx>,
	}) satisfies BetterAuthClientPlugin;
