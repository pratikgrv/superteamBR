export const routing = {
	locales: ["en", "pt", "es"],
	defaultLocale: "en",
} as const;

export type Locale = (typeof routing.locales)[number];
