import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { geistSans, geistMono } from "@/app/fonts";
import { WalletProvider } from "@/providers/WalletProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import "@/styles/globals.css";

export const metadata: Metadata = {
	title: "Superteam Brazil LMS",
	description: "The ultimate learning platform for Solana-native developers.",
};

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
		<html lang={locale}>
			<head>
				<title>Superteam Brazil LMS</title>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider>
					<NextIntlClientProvider messages={messages}>
						<WalletProvider>{children}</WalletProvider>
					</NextIntlClientProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
