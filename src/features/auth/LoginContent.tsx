"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@solana/wallet-adapter-react"

import { authClient } from "@/lib/auth/authClient"
import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWalletSignIn } from "@/hooks/useWalletSignIn"
import { toast } from "sonner"

export default function LoginPage() {
  const { setVisible } = useWalletModal()
  const { connected, publicKey, signMessage, disconnect } = useWallet()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const isAuthenticatingRef = useRef(false)
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null)
  const { signInWithWallet, isLoading, status, error, reset } = useWalletSignIn();

  useEffect(() => {
    if (status === "error" && error) {
      toast.error("Authentication Failed", { description: error });
    } else if (status === "authenticated" || status === "linked") {
      toast.success("Successfully authenticated!");
    } else if (status === "signing") {
      toast.loading("Wallet request active", { description: "Please sign the message in your wallet.", id: "wallet-auth" });
    }
    
    // Clear the ongoing auth toast when we reach a terminal or idle state
    if (status === "error" || status === "authenticated" || status === "linked" || status === "idle") {
      toast.dismiss("wallet-auth");
    }
  }, [status, error]);
  
console.log("connected", connected)
console.log("publicKey", publicKey)
console.log("signMessage", signMessage)
console.log("disconnect", disconnect)
console.log("isAuthenticating", isAuthenticating)
  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      })
    } catch (error) {
      console.error(`${provider} login error:`, error)
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6 relative overflow-hidden bg-background">
      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
        onClick={() => window.history.back()}
      >
        back
      </Button>

      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-xl shadow-lg shadow-primary/20">
          🇧🇷
        </div>

        <div>
          <div className="font-extrabold text-2xl tracking-tight text-foreground uppercase">
            superteam <span className="text-primary">BRASIL</span>
          </div>
          <div className="text-muted-foreground text-xs font-semibold tracking-widest">
            ACADEMY
          </div>
        </div>
      </div>

      {/* Hero Text */}
      <div className="text-center max-w-sm">
        <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-3">
          Learn Solana.
          <br />
          <span className="text-primary">
            Build the Future.
          </span>
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Connect your wallet to access courses, earn XP, and claim on-chain credentials.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="flex flex-col space-y-2">
          {!publicKey ? (
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                reset();
                setVisible(true);
              }}
              disabled={socialLoading !== null}
              className="w-full font-bold"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex flex-col space-y-3 items-center text-center p-4 rounded-xl border border-border bg-card">
              <p className="text-sm font-medium">
                Connected: <span className="text-primary ">{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</span>
              </p>
              {isLoading && <p className="text-xs text-muted-foreground flex items-center gap-2 animate-pulse"><Loader2 className="h-3 w-3 animate-spin"/> Authenticating...</p>}
              {!isLoading && (status === "idle" || status === "error") && (
                <Button onClick={signInWithWallet} className="w-full font-bold" variant={status === "error" ? "destructive" : "default"}>
                  {status === "error" ? "Retry Sign In" : "Complete Sign In"}
                </Button>
              )}
              {status === "error" && (
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={async () => {
                  await disconnect();
                  reset();
                }}>
                  Disconnect Wallet
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider shrink-0">
            or continue with
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Auth */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full font-medium"
            onClick={() => handleSocialLogin("google")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Google"}
          </Button>

          <Button
            variant="outline"
            className="w-full font-medium"
            onClick={() => handleSocialLogin("github")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "github" ? <Loader2 className="h-4 w-4 animate-spin" /> : "GitHub"}
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground text-[10px] text-center mt-4 max-w-[200px]">
        Wallet required to earn XP & receive on-chain credentials
      </p>
    </div>
  )
}
