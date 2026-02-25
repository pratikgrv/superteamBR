import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { AccountSection } from "@/components/AccountSection";
import { redirect } from "@/lib/i18n/routing";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { account } from "@/lib/db/schema";

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
	const { locale } = await params;
	// 1. Get session server-side
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		redirect({ href: "/", locale });
	}

	// 2. Fetch linked accounts server-side — no useEffect, no client fetch
	const accounts = await db
		.select({
			id: account.id,
			userId: account.userId,
			providerId: account.providerId,
			accountId: account.accountId,
		})
		.from(account)
		.where(eq(account.userId, session!.user.id as string));

	// 3. Pass as props — AccountSection is pure UI
	return (
		<main style={{ padding: 24 }}>
			<h1 style={{ marginBottom: 20 }}>Account</h1>
			<AccountSection accounts={accounts} />
		</main>
	);
}
