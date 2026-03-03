import type { Metadata } from "next";

import "@/styles/globals.css";

export const metadata: Metadata = {
	title: "Superteam Brazil LMS",
	description: "The ultimate learning platform for Solana-native developers.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
