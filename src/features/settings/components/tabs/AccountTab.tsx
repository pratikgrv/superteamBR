"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Wallet } from "lucide-react";
import { toast } from "sonner";

interface AccountTabProps {
  user?: {
    email?: string | null;
    name?: string | null;
  };
}

// Demo wallet addresses — in a real app these come from the user's DB record
const MOCK_WALLETS = [
  { address: "7xKXt…9qB3", label: "Phantom", connected: true },
];

const GOOGLE_ICON = (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="w-4 h-4"
    fill="currentColor"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export function AccountTab({ user }: AccountTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  async function handlePasswordChange() {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated");
  }

  return (
    <div className="space-y-6">
      {/* Email */}
   
      {/* Password */}
  
      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="w-4 h-4" aria-hidden="true" />
            Connected Wallets
          </CardTitle>
          <CardDescription>
            Solana wallets linked to your account for on-chain rewards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_WALLETS.length > 0 ? (
            <ul className="space-y-2" aria-label="Connected wallets">
              {MOCK_WALLETS.map((w) => (
                <li
                  key={w.address}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Wallet className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{w.address}</p>
                      <p className="text-xs text-muted-foreground">{w.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {w.connected ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => toast.info("Wallet disconnect coming soon")}
                    >
                      Disconnect
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground py-2">No wallets connected yet.</p>
          )}
          <Button variant="outline" size="sm" onClick={() => toast.info("Wallet connect coming soon")}>
            Connect Wallet
          </Button>
        </CardContent>
      </Card>

      {/* OAuth Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connected Accounts</CardTitle>
          <CardDescription>
            Link third-party providers for one-click sign-in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              id: "google",
              label: "Google",
              icon: GOOGLE_ICON,
              connected: false,
            },
            {
              id: "github",
              label: "GitHub",
              icon: <Github className="w-4 h-4" aria-hidden="true" />,
              connected: false,
            },
          ].map((provider) => (
            <div
              key={provider.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="text-foreground">{provider.icon}</span>
                <div>
                  <p className="text-sm font-medium">{provider.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {provider.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant={provider.connected ? "outline" : "secondary"}
                size="sm"
                onClick={() =>
                  toast.info(`${provider.label} ${provider.connected ? "disconnect" : "connect"} coming soon`)
                }
              >
                {provider.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently remove your account and all associated data.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("Account deletion requires contacting support.")}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
