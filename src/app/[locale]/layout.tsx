import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

import { inter, geistMono } from "@/app/fonts";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import { Toaster } from "@/components/ui/sonner";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<title>Superteam Brazil LMS</title>
			</head>
			<body
				className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextIntlClientProvider messages={messages}>
						<WalletProvider>{children}</WalletProvider>
					</NextIntlClientProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
