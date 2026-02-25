"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback, useState } from "react";

import { useWalletSignIn } from "@/hooks/useWalletSignIn";
import { authClient } from "@/lib/auth/client";
import { ThemeToggle } from "./ThemeToggle";

export default function LoginPage() {
  const { wallets, publicKey, select } = useWallet();
  const { setVisible } = useWalletModal();
  const { signInWithWallet, isLoading, status, error } = useWalletSignIn();
  const [loadingSocial, setLoadingSocial] = useState<
    "google" | "github" | null
  >(null);

  const signInSocial = useCallback(async (provider: "google" | "github") => {
    setLoadingSocial(provider);
    await authClient.signIn.social({ provider, callbackURL: "/" });
    setLoadingSocial(null);
  }, []);

  const installed = wallets.filter((w) => w.readyState === "Installed");
  const notInstalled = wallets.filter((w) => w.readyState === "NotDetected");

  return (
    <main className="min-h-screen text-foreground p-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Superteam Academy</h1>
        <ThemeToggle />
      </div>
      <p>Sign in to continue</p>

      {/* Social */}
      <section>
        <h2>Social</h2>
        <button
          onClick={() => signInSocial("google")}
          disabled={!!loadingSocial}
        >
          {loadingSocial === "google"
            ? "Redirecting..."
            : "Continue with Google"}
        </button>
        <button
          onClick={() => signInSocial("github")}
          disabled={!!loadingSocial}
        >
          {loadingSocial === "github"
            ? "Redirecting..."
            : "Continue with GitHub"}
        </button>
      </section>

      <hr />

      {/* Wallet */}
      <section>
        <h2>Wallet</h2>

        {!publicKey && (
          <>
            {installed.length === 0 && <p>No wallet detected.</p>}

            {installed.map((w) => (
              <div key={w.adapter.name}>
                <span>{w.adapter.name} (detected)</span>{" "}
                {/* select() sets the active wallet; autoConnect + useWalletSignIn handle the rest */}
                <button
                  onClick={() => select(w.adapter.name)}
                  disabled={isLoading}
                >
                  Connect
                </button>
              </div>
            ))}

            <button onClick={() => setVisible(true)}>More wallets</button>

            {notInstalled.length > 0 && (
              <>
                <p>Not installed:</p>
                {notInstalled.map((w) => (
                  <div key={w.adapter.name}>
                    <a
                      href={w.adapter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {w.adapter.name} — Install
                    </a>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {publicKey && (
          <div>
            <span>
              {publicKey.toBase58().slice(0, 6)}...
              {publicKey.toBase58().slice(-4)}
            </span>{" "}
            {isLoading && <span>Signing in...</span>}
            {/* Manual fallback if auto sign-in didn't fire */}
            {!isLoading && status === "idle" && (
              <button onClick={signInWithWallet}>Sign in</button>
            )}
          </div>
        )}
      </section>

      {status !== "idle" && <p>Status: {status}</p>}
      {error && <p>Error: {error}</p>}
    </main>
  );
}
