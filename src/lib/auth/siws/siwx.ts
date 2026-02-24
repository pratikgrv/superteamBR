import { createAuthEndpoint } from "better-auth/plugins";
import { APIError, getSessionFromCtx, sessionMiddleware } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import type { User } from "better-auth/types";
import { z } from "zod";

export type ChainType = "solana";

export interface SIWXPluginOptions {
	domain: string;
	emailDomainName?: string | undefined;
	anonymous?: boolean | undefined;
	statement?: string | undefined;
	getNonce?: () => Promise<string>;
	verifyMessage?: (args: {
		message: string;
		signature: string;
		address: string;
		chainType: "solana";
		chainId: string;
		nonce: string;
	}) => Promise<boolean>;
	nameLookup?: (args: {
		address: string;
		chainType: string;
		chainId: string;
	}) => Promise<{ name?: string; avatar?: string } | undefined>;
}

const getSiwxNonceBodySchema = z.object({
	address: z.string().min(1),
	chainType: z.literal("solana"),
	chainId: z.string().optional(),
});
async function verifySolanaSignature(
	message: string,
	signature: string,
	address: string,
	nonce: string,
): Promise<boolean> {
	// Path 1: SIWS One-Click (CAIP-122) — Phantom, Solflare modern
	if (message.startsWith('{"input":')) {
		try {
			const { input, output } = JSON.parse(message) as {
				input: { nonce: string; address?: string };
				output: {
					account: {
						address: string;
						publicKey: number[];
						chains: string[];
						features: string[];
					};
					signedMessage: number[];
					signature: number[];
				};
			};

			// Nonce must match what we issued
			if (input.nonce !== nonce) return false;
			// Address must match if provided in input
			if (input.address && input.address !== address) return false;

			const { verifySignIn } = await import("@solana/wallet-standard-util");
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

	// Path 2: Legacy fallback — raw message signing
	// For legacy, the message MUST embed the nonce so it can't be replayed
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
}
const verifySiwxBodySchema = z.object({
	message: z.string().min(1),
	signature: z.string().min(1),
	address: z.string().min(1),
	chainType: z.literal("solana"),
	chainId: z.string().optional(),
	signatureType: z.string().optional(),
	email: z.email().optional(),
});
export const siwx = (options: SIWXPluginOptions) => {
	const statement = options.statement ?? "Sign in with your wallet";

	// .refine((data) => options.anonymous !== false || !!data.email, {
	// 	message:
	// 		"Email is required when the anonymous plugin option is disabled.",
	// 	path: ["email"],
	// });
	// {
	//     "message": "{\"input\":{\"domain\":\"localhost:3000\",\"address\":\"CfK99Zo6zcpiZMDTveXYTEJXouvrNd2cKw9C1yVQSNAR\",\"statement\":\"Sign in to Superteam Brazil LMS\",\"uri\":\"http://localhost:3000\",\"version\":\"1\",\"chainId\":\"mainnet\",\"nonce\":\"vJ1QAWyvzRmEg3bOSOcsxSv0c3M0qsrk\"},\"output\":{\"account\":{\"publicKey\":[173,65,35,112,167,189,248,172,214,14,169,237,152,7,217,150,192,181,32,173,168,123,49,133,228,32,102,221,3,244,190,238]},\"signedMessage\":[108,111,99,97,108,104,111,115,116,58,51,48,48,48,32,119,97,110,116,115,32,121,111,117,32,116,111,32,115,105,103,110,32,105,110,32,119,105,116,104,32,121,111,117,114,32,83,111,108,97,110,97,32,97,99,99,111,117,110,116,58,10,67,102,75,57,57,90,111,54,122,99,112,105,90,77,68,84,118,101,88,89,84,69,74,88,111,117,118,114,78,100,50,99,75,119,57,67,49,121,86,81,83,78,65,82,10,10,83,105,103,110,32,105,110,32,116,111,32,83,117,112,101,114,116,101,97,109,32,66,114,97,122,105,108,32,76,77,83,10,10,85,82,73,58,32,104,116,116,112,58,47,47,108,111,99,97,108,104,111,115,116,58,51,48,48,48,10,86,101,114,115,105,111,110,58,32,49,10,67,104,97,105,110,32,73,68,58,32,109,97,105,110,110,101,116,10,78,111,110,99,101,58,32,118,74,49,81,65,87,121,118,122,82,109,69,103,51,98,79,83,79,99,115,120,83,118,48,99,51,77,48,113,115,114,107],\"signature\":[110,44,121,187,122,229,147,234,44,207,128,40,76,236,41,65,118,134,10,25,71,247,80,108,255,131,188,184,152,33,168,125,129,204,106,174,171,246,185,217,1,176,196,57,137,166,76,49,11,251,205,100,63,72,128,163,205,86,118,112,200,81,214,13]}}",
	//     "signature": "3CkyEe56Xc2KLvt5xcqRc9Sx4pDFNVrg4rHhM1CDe8pt9Yc9SGgN4wRvtdL14zYzG5AWJtpcSQhQH1aRX15cSyt8",
	//     "address": "CfK99Zo6zcpiZMDTveXYTEJXouvrNd2cKw9C1yVQSNAR",
	//     "chainType": "solana"
	// }
	return {
		id: "siwx",
		endpoints: {
			getSiwxNonce: createAuthEndpoint(
				"/siwx/nonce",
				{ method: "POST", body: getSiwxNonceBodySchema },
				async (ctx) => {
					const { address, chainType, chainId: requestedChainId } = ctx.body;
					const chainId = requestedChainId ?? "mainnet";

					const { generateRandomString } = await import("better-auth/crypto");
					const nonce =
						options.getNonce ?
							await options.getNonce()
						:	await generateRandomString(32, "a-z", "A-Z", "0-9");
					const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

					const verificationAcc =
						await ctx.context.internalAdapter.createVerificationValue({
							identifier: `siwx:${chainType}:${chainId}:${address}`,
							value: nonce,
							expiresAt,
						});
					console.log("nonce verication val", verificationAcc);

					return ctx.json({
						nonce,
						expiresAt: expiresAt.toISOString(),
						statement,
						chainId,
					});
				},
			),
			verifySiwxMessage: createAuthEndpoint(
				"/siwx/verify",
				{
					method: "POST",
					body: verifySiwxBodySchema,
					requireRequest: true,
					//use: [sessionMiddleware],
				},
				async (ctx) => {
					const {
						message,
						signature,
						address,
						chainType,
						chainId: requestedChainId,
						email,
					} = ctx.body;
					console.log({
						message,
						signature,
						address,
						chainType,
						chainId: requestedChainId,
						email,
					});
					const chainId = requestedChainId ?? "mainnet";
					const accountId = `${chainType}:${chainId}:${address}`;
					const identifier = `siwx:${chainType}:${chainId}:${address}`;
					try {
						// ── Step 1: Validate nonce (fetch before verification)
						const verification =
							await ctx.context.internalAdapter.findVerificationValue(
								identifier,
							);

						console.log("verification get for nonce", verification);
						if (!verification || new Date() > verification.expiresAt) {
							throw new APIError("UNAUTHORIZED", {
								message: "Invalid or expired nonce. Request a new one.",
							});
						}

						const { value: nonce } = verification;
						console.log("verification id", verification);

						// ── Step 2: Consume nonce IMMEDIATELY — one-time use regardless of outcome
						// This prevents replay attacks even if verification fails below
						await ctx.context.internalAdapter.deleteVerificationValue(
							verification.id,
						);

						// ── Step 3: Verify the cryptographic signature
						const verified =
							options.verifyMessage ?
								await options.verifyMessage({
									message,
									signature,
									address,
									chainType,
									chainId,
									nonce,
								})
							:	await verifySolanaSignature(message, signature, address, nonce);

						if (!verified) {
							throw new APIError("UNAUTHORIZED", {
								message: "Invalid signature.",
							});
						}

						// ── Step 4: Detect which scenario we're in
						//
						// ctx.context.session is populated by useSession: true
						// It's the EXISTING session (Google/GitHub user) if one exists
						const existingSession =  await getSessionFromCtx(ctx);

						const currentlyLoggedInUser: User | null =
							existingSession?.user ?? null;

						// Check if this wallet address is already registered
						const existingWalletAccount =
							await ctx.context.internalAdapter.findAccountByProviderId(
								accountId,
								"siwx",
							);

						let targetUser: User | null = null;

						if (existingWalletAccount) {
							// ── SCENARIO B or C (wallet account already exists) ──────────────

							const walletOwner =
								await ctx.context.internalAdapter.findUserById(
									existingWalletAccount.userId,
								);

							if (currentlyLoggedInUser) {
								// SCENARIO C variant: user is logged in AND wallet belongs to someone else
								// This is a conflict — refuse to link
								if (existingWalletAccount.userId !== currentlyLoggedInUser.id) {
									throw new APIError("BAD_REQUEST", {
										message:
											"This wallet is already linked to a different account. " +
											"Please disconnect it from that account first.",
									});
								}
								// Wallet already linked to THIS user — treat as re-login, just refresh session
								targetUser = currentlyLoggedInUser;
							} else {
								// SCENARIO B: Returning wallet user, no active session
								// Just log them in as the wallet owner
								targetUser = walletOwner;
							}
						} else {
							// ── Wallet account does NOT exist yet ─────────────────────────────
							console.log(
								"google login or social avail",
								currentlyLoggedInUser,
							);
							if (currentlyLoggedInUser) {
								// ── SCENARIO C: Google/GitHub user linking their wallet ───────────
								// The wallet is new — link it to the currently logged-in user
								targetUser = currentlyLoggedInUser;
								const userAccounts =
									await ctx.context.internalAdapter.findAccountByUserId(
										currentlyLoggedInUser.id,
									);

								const existingWalletAccount = userAccounts.find(
									(a) => a.providerId === "siwx",
								);
								if (existingWalletAccount) {
									// User already has a wallet — reject the link attempt
									throw new APIError("BAD_REQUEST", {
										message:
											"You already have a wallet linked to your account. " +
											"Only one wallet per account is allowed.",
									});
								}
								console.log("linking account should create wallet account ");
								await ctx.context.internalAdapter.createAccount({
									userId: targetUser.id,
									providerId: "siwx",
									accountId,
									createdAt: new Date(),
									updatedAt: new Date(),
								});

								// Update primaryWalletAddress on user if not already set
								// (type cast needed because Better Auth's User type doesn't include custom fields)
								// const userWithWallet = targetUser as User & {
								// 	primaryWalletAddress?: string;
								// };
								// if (!userWithWallet.primaryWalletAddress) {
								// 	await ctx.context.internalAdapter.updateUser(targetUser.id, {
								// 		primaryWalletAddress: address,
								// 	});
								// }

								// Return early — no new session needed, existing session is still valid
								// The client should refetch the session to get updated user data
								return ctx.json({
									success: true,
									linked: true, // flag so client knows this was a link, not a login
									user: { id: targetUser.id, address, chainType, chainId },
								});
							} else {
								// ── SCENARIO A: Brand new user, wallet never seen before ──────────
								//const isAnon = options.anonymous ?? true;
								const domain =
									options.emailDomainName ??
									new URL(ctx.context.baseURL).hostname;

								// Generate email — prefix with chain to avoid collisions across chains
								const generatedEmail =
									email ? email : `solana.${address}@${domain}`;

								const { name, avatar } =
									(await options.nameLookup?.({
										address,
										chainType,
										chainId,
									})) ?? {};

								// Create the User row
								const newUser = await ctx.context.internalAdapter.createUser({
									name: name ?? `${address.slice(0, 4)}...${address.slice(-4)}`,
									email: generatedEmail,
									image: avatar ?? "",
									// Custom fields — Better Auth passes extra fields through
									//primaryWalletAddress: address,
								});

								// Create the Account row linking this wallet to the new user
								await ctx.context.internalAdapter.createAccount({
									userId: newUser.id,
									providerId: "siwx",
									accountId,
									createdAt: new Date(),
									updatedAt: new Date(),
								});

								targetUser = newUser;
							}
						}

						if (!targetUser) {
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to resolve user. Please try again.",
							});
						}

						// ── Step 5: Create session and set cookie
						const session = await ctx.context.internalAdapter.createSession(
							targetUser.id,
							//ctx.request,
						);

						if (!session) {
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to create session.",
							});
						}

						await setSessionCookie(ctx, { session, user: targetUser });

						return ctx.json({
							success: true,
							linked: false,
							token: session.token,
							user: { id: targetUser.id, address, chainType, chainId },
						});
					} catch (error) {
						console.log("error in siwx verify", error);
						return ctx.json({});
					}
				},
			),
		},
	};
};
