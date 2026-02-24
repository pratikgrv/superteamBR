import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { wallet } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import bs58 from "bs58";
import nacl from "tweetnacl";

export async function GET(req: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return Response.json({ error: "Unauthorized" }, { status: 401 });

	const userWallets = await db
		.select()
		.from(wallet)
		.where(eq(wallet.userId, session.user.id));

	const userAccounts = await db
		.select()
		.from(schema.account)
		.where(eq(schema.account.userId, session.user.id));

	return Response.json({ wallets: userWallets, accounts: userAccounts });
}

export async function POST(req: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return Response.json({ error: "Unauthorized" }, { status: 401 });

	const { address, signature, message } = await req.json();

	try {
		const msgBytes = new TextEncoder().encode(message);
		const sigBytes = bs58.decode(signature);
		const pubKeyBytes = bs58.decode(address);
		const isValid = nacl.sign.detached.verify(msgBytes, sigBytes, pubKeyBytes);

		if (!isValid)
			return Response.json({ error: "Invalid signature" }, { status: 400 });

		await db.insert(wallet).values({
			id: crypto.randomUUID(),
			userId: session.user.id,
			address,
			isPrimary: false,
			createdAt: new Date(),
		});

		return Response.json({ success: true });
	} catch (e: any) {
		return Response.json({ error: e.message }, { status: 400 });
	}
}

export async function DELETE(req: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return Response.json({ error: "Unauthorized" }, { status: 401 });

	const { address } = await req.json();

	try {
		await db.delete(wallet).where(eq(wallet.address, address));
		return Response.json({ success: true });
	} catch (e: any) {
		return Response.json({ error: e.message }, { status: 400 });
	}
}
