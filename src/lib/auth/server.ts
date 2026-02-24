import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../env";
import { db } from "../db";
import * as schema from "../db/schema";
import { siwx } from "./siws/siwx";
import { multiSession } from "better-auth/plugins";
import { generateRandomString } from "better-auth/crypto";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		},
	}),
	baseURL: env.NEXT_PUBLIC_APP_URL,
	user: {
		additionalFields: {
			username: {
				type: "string",
			},
		},
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID || "dummy_client_id",
			clientSecret: env.GITHUB_CLIENT_SECRET || "dummy_client_secret",
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID || "dummy_client_id",
			clientSecret: env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
		},
	},
	plugins: [
		multiSession(),
		siwx({
			domain: env.NEXT_PUBLIC_APP_URL || "localhost:3000",
			nameLookup: async ({ address }: { address: string }) => {
				// Shorten public key for name if no user profile is set
				return { name: address.slice(0, 4) + "..." + address.slice(-4) };
			},
			getNonce: async () => {
				const { generateRandomString } = await import("better-auth/crypto");
				return generateRandomString(32, "a-z", "A-Z", "0-9");
			},
			verifyMessage: async ({ message, signature, address, nonce }) => {
				// SIWS one-click
				if (message.startsWith('{"input":')) {
					try {
						const { input, output } = JSON.parse(message);
						if (input.nonce !== nonce) return false;
						const { verifySignIn } =
							await import("@solana/wallet-standard-util");
						const { default: bs58 } = await import("bs58");
						return verifySignIn(input, {
							account: {
								address: output.account.address,
								publicKey: new Uint8Array(output.account.publicKey),
								chains: output.account.chains ?? [],
								features: output.account.features ?? [],
							} as Parameters<typeof verifySignIn>[1]["account"],
							signedMessage: new Uint8Array(output.signedMessage),
							signature: bs58.decode(signature),
						});
					} catch {
						return false;
					}
				}
				// Legacy
				if (!message.includes(nonce)) return false;
				try {
					const { default: bs58 } = await import("bs58");
					const { default: nacl } = await import("tweetnacl");
					return nacl.sign.detached.verify(
						new TextEncoder().encode(message),
						bs58.decode(signature),
						bs58.decode(address),
					);
				} catch {
					return false;
				}
			},
		}),
	],
	account: {
		accountLinking: {
			allowDifferentEmails: true,
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user, ctx) => {
					let attempts = 0;

					while (attempts < 5) {
						const username = `user_${await generateRandomString(8, "a-z", "0-9")}`;

						const existing = await db.query.user.findFirst({
							where: (table, { eq }) => eq(table.username, username),
						});

						if (!existing) {
							return {
								data: {
									...user,
									username,
								},
							};
						}

						attempts++;
					}

					throw new Error("Failed to generate a unique username.");
				},
			},
		},
		account: {
			create: {
				before: async (account, ctx) => {
					const existing = await db.query.account.findFirst({
						where: (table, { and, eq }) =>
							and(
								eq(table.providerId, account.providerId),
								eq(table.accountId, account.accountId),
							),
					});
					if (existing && existing.userId !== account.userId) {
						throw new Error(
							"This social account is already linked to another user.",
						);
					}
					return true;
				},
			},
		},
	},
});
