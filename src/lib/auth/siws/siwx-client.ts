import type { BetterAuthClientPlugin } from "better-auth";
import type { siwx } from "./siwx";

export const siwxClient = () =>
  ({
    id: "siwx",
    $InferServerPlugin: {} as ReturnType<typeof siwx>,
  }) satisfies BetterAuthClientPlugin;
