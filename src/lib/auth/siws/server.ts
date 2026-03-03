import {
  APIError,
  getSessionFromCtx,
} from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { createAuthEndpoint } from 'better-auth/api';
import type { User } from "better-auth/types";
import { z } from "zod";

export type ChainType = "solana";

export interface SIWSPluginOptions {
  domain: string;
  emailDomainName?: string;
  anonymous?: boolean;
  statement?: string;
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


const nonceSchema = z.object({
  address: z.string().min(1),
 
  chainId: z.string().optional(),
});

const verifySchema = z.object({
  message: z.string().min(1),
  signature: z.string().min(1),
  address: z.string().min(1),
  chainId: z.string().optional(),
  email: z.string().email().optional(),
});


async function verifySolanaSignature(
  message: string,
  signature: string,
  address: string,
  nonce: string,
): Promise<boolean> {
  if (!message.includes(nonce)) return false;

  const { default: bs58 } = await import("bs58");
  const { default: nacl } = await import("tweetnacl");

  return nacl.sign.detached.verify(
    new TextEncoder().encode(message),
    bs58.decode(signature),
    bs58.decode(address),
  );
}

async function resolveUserForWallet({
  ctx,
  accountId,
  currentlyLoggedInUser,
}: {
  ctx: any;
  accountId: string;
  currentlyLoggedInUser: User | null;
}): Promise<{ user: User; linked: boolean }> {
  const adapter = ctx.context.internalAdapter;

  const existingWalletAccount =
    await adapter.findAccountByProviderId(accountId, "siws");

  if (existingWalletAccount) {
    const walletOwner = await adapter.findUserById(
      existingWalletAccount.userId,
    );

    if (!walletOwner) {
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Wallet owner not found.",
      });
    }

    if (currentlyLoggedInUser) {
      if (currentlyLoggedInUser.id !== walletOwner.id) {
        throw new APIError("BAD_REQUEST", {
          message:
            "This wallet is already linked to another account.",
        });
      }

      return { user: currentlyLoggedInUser, linked: false };
    }

    return { user: walletOwner, linked: false };
  }

  // Wallet does not exist
  if (currentlyLoggedInUser) {
    const existingAccounts =
      await adapter.findAccountByUserId(currentlyLoggedInUser.id);

    const alreadyLinked = existingAccounts.find(
      (a: any) => a.providerId === "siws",
    );

    if (alreadyLinked) {
      throw new APIError("BAD_REQUEST", {
        message:
          "You already have a wallet linked to your account.",
      });
    }

    await adapter.createAccount({
      userId: currentlyLoggedInUser.id,
      providerId: "siws",
      accountId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { user: currentlyLoggedInUser, linked: true };
  }

  throw new Error("NEW_USER_REQUIRED");
}

async function createWalletUser({
  ctx,
  address,
  email,
  chainType,
  chainId,
  accountId,
  options,
}: any): Promise<User> {
  const adapter = ctx.context.internalAdapter;

  const domain =
    options.emailDomainName ??
    new URL(ctx.context.baseURL).hostname;

  const generatedEmail =
    email ?? `solana.${address}@${domain}`;

  const { name, avatar } =
    (await options.nameLookup?.({
      address,
      chainType,
      chainId,
    })) ?? {};

  const newUser = await adapter.createUser({
    name: name ?? `${address.slice(0, 4)}...${address.slice(-4)}`,
    email: generatedEmail,
    image: avatar ?? "",
  });

  await adapter.createAccount({
    userId: newUser.id,
    providerId: "siws",
    accountId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return newUser;
}

/* -------------------------------------------------------------------------- */
/*                                  Plugin                                    */
/* -------------------------------------------------------------------------- */

export const siws = (options: SIWSPluginOptions) => {
  const statement =
    options.statement ?? "Sign in with your wallet";

  return {
    id: "siws",
    endpoints: {
      /* ------------------------------ Get Nonce ----------------------------- */

      nonce: createAuthEndpoint(
        "/siws/nonce",
        { method: "POST", body: nonceSchema },
        async (ctx) => {
          const chainType="solana"
          const { address, chainId } = ctx.body;
          const resolvedChainId = chainId ?? "devnet";

          const { generateRandomString } = await import(
            "better-auth/crypto"
          );

          const nonce = options.getNonce
            ? await options.getNonce()
            : await generateRandomString(
                32,
                "a-z",
                "A-Z",
                "0-9",
              );

          const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000,
          );

          await ctx.context.internalAdapter.createVerificationValue(
            {
              identifier: `siws:${chainType}:${resolvedChainId}:${address}`,
              value: nonce,
              expiresAt,
            },
          );

          return ctx.json({
            nonce,
            expiresAt: expiresAt.toISOString(),
            statement,
            chainId: resolvedChainId,
          });
        },
      ),

      /* ---------------------------- Verify Message --------------------------- */

      verify: createAuthEndpoint(
        "/siws/verify",
        { method: "POST", body: verifySchema },
        async (ctx) => {
          const {
            message,
            signature,
            address,
            
            chainId,
            email,
          } = ctx.body;
   const chainType="solana"
          const resolvedChainId = chainId ?? "devnet";
          const accountId = `${chainType}:${resolvedChainId}:${address}`;
          const identifier = `siws:${chainType}:${resolvedChainId}:${address}`;
          const adapter = ctx.context.internalAdapter;

          /* ------------------------ Validate Nonce ------------------------ */

          const verification =
            await adapter.findVerificationValue(identifier);

          if (
            !verification ||
            new Date() > verification.expiresAt
          ) {
            throw new APIError("UNAUTHORIZED", {
              message:
                "Invalid or expired nonce. Request a new one.",
            });
          }

          await adapter.deleteVerificationValue(
            verification.id,
          );

          const verified = options.verifyMessage
            ? await options.verifyMessage({
                message,
                signature,
                address,
                chainType,
                chainId: resolvedChainId,
                nonce: verification.value,
              })
            : await verifySolanaSignature(
                message,
                signature,
                address,
                verification.value,
              );

          if (!verified) {
            throw new APIError("UNAUTHORIZED", {
              message: "Invalid signature.",
            });
          }

          /* ---------------------- Resolve User Flow ---------------------- */

          const existingSession =
            await getSessionFromCtx(ctx);

          const currentlyLoggedInUser =
            existingSession?.user ?? null;

          let user: User;
          let linked = false;

          try {
            const result = await resolveUserForWallet({
              ctx,
              accountId,
              currentlyLoggedInUser,
            });

            user = result.user;
            linked = result.linked;
          } catch (err: any) {
            if (err.message === "NEW_USER_REQUIRED") {
              user = await createWalletUser({
                ctx,
                address,
                email,
                chainType,
                chainId: resolvedChainId,
                accountId,
                options,
              });
            } else {
              throw err;
            }
          }

          /* -------------------------- Create Session -------------------------- */

          const session =
            await adapter.createSession(user.id);

          if (!session) {
            throw new APIError(
              "INTERNAL_SERVER_ERROR",
              { message: "Failed to create session." },
            );
          }

          await setSessionCookie(ctx, {
            session,
            user,
          });

          return ctx.json({
            success: true,
            linked,
            token: session.token,
            user: {
              id: user.id,
              address,
              chainType,
              chainId: resolvedChainId,
            },
          });
        },
      ),
    },
  };
};