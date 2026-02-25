import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);
// need modification will update later
export const config = {
	// Match only internationalized pathnames
	matcher: ["/", "/(en|pt|es)/:path*"],
};
