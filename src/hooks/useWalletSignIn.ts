"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useCallback, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth/client";

export type WalletSignInStatus =
  | "idle"
  | "signing"
  | "authenticated"
  | "linked"
  | "error";

export function useWalletSignIn() {
  const { publicKey, signMessage, signIn, disconnect } = useWallet();
  const { data: session, refetch: refetchSession } = authClient.useSession();
  const [status, setStatus] = useState<WalletSignInStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const isSigningRef = useRef(false);

  const signInWithWallet = useCallback(async () => {
    if (!publicKey || isSigningRef.current) return;

    isSigningRef.current = true;
    setStatus("signing");
    setError(null);

    try {
      const address = publicKey.toBase58();

      // 1. Get nonce
      const nonceRes = await authClient.siwx.nonce({
        address,
        chainType: "solana",
      });

      if (nonceRes.error || !nonceRes.data) {
        throw new Error(nonceRes.error?.message ?? "Failed to get nonce");
      }

      const { nonce } = nonceRes.data as { nonce: string };

      // 2. Sign
      let message: string;
      let signature: string;

      if (signIn) {
        // Modern SIWS one-click (Phantom, Solflare)
        const signInInput = {
          domain: window.location.host,
          address,
          statement: "Sign in to Superteam Brazil LMS",
          uri: window.location.origin,
          version: "1",
          chainId: "mainnet",
          nonce,
        };

        let output: Awaited<ReturnType<NonNullable<typeof signIn>>>;
        try {
          output = await signIn(signInInput);
        } catch {
          throw new Error("Sign-in request declined by user.");
        }

        message = JSON.stringify({
          input: signInInput,
          output: {
            ...output,
            account: {
              ...output.account,
              publicKey: Array.from(output.account.publicKey),
            },
            signedMessage: Array.from(output.signedMessage),
            signature: Array.from(output.signature),
          },
        });
        signature = bs58.encode(output.signature);
      } else if (signMessage) {
        // Legacy fallback — nonce embedded so server can validate it
        const structured = [
          "Sign in to Superteam Brazil LMS",
          `Domain: ${window.location.host}`,
          `Address: ${address}`,
          `Nonce: ${nonce}`,
          `Issued At: ${new Date().toISOString()}`,
        ].join("\n");

        let signedBytes: Uint8Array;
        try {
          signedBytes = await signMessage(new TextEncoder().encode(structured));
        } catch {
          throw new Error("Message signing declined by user.");
        }

        message = structured;
        signature = bs58.encode(signedBytes);
      } else {
        throw new Error("Wallet does not support message signing.");
      }

      // 3. Verify
      const verifyRes = await authClient.siwx.verify({
        message,
        signature,
        address,
        chainType: "solana",
      });

      if (verifyRes.error) {
        throw new Error(verifyRes.error.message ?? "Verification failed");
      }

      const result = verifyRes.data as { linked?: boolean } | undefined;

      if (result?.linked) {
        setStatus("linked");
      } else {
        setStatus("authenticated");
      }

      await refetchSession();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setStatus("error");
      // Only disconnect on login failure, not on link failure
      if (!session?.user) await disconnect();
    } finally {
      isSigningRef.current = false;
    }
  }, [
    publicKey,
    signIn,
    signMessage,
    disconnect,
    session?.user,
    refetchSession,
  ]);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    await disconnect();
    setStatus("idle");
    setError(null);
  }, [disconnect]);

  // Auto-trigger sign-in when wallet connects and no session exists
  useEffect(() => {
    if (
      publicKey &&
      !session?.user &&
      status === "idle" &&
      !isSigningRef.current
    ) {
      signInWithWallet();
    }
    // Intentionally only react to publicKey changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return {
    status,
    error,
    isLoading: status === "signing",
    isAuthenticated: status === "authenticated" || status === "linked",
    signInWithWallet,
    signOut,
  };
}
