"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./tabs/ProfileTab";
import { AccountTab } from "./tabs/AccountTab";
import { PreferencesTab } from "./tabs/PreferencesTab";
import { PrivacyTab } from "./tabs/PrivacyTab";
import { Bell, Lock, Settings2, User } from "lucide-react";

interface SettingsPageProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const TABS = [
  {
    value: "profile",
    label: "Profile",
    icon: <User className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "account",
    label: "Account",
    icon: <Settings2 className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "preferences",
    label: "Preferences",
    icon: <Bell className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "privacy",
    label: "Privacy",
    icon: <Lock className="w-4 h-4" aria-hidden="true" />,
  },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function SettingsPage({ user }: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your account, preferences, and privacy.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="flex flex-col sm:flex-row gap-8">
          {/* Vertical sidebar nav on sm+ screens */}
          
            <TabsList className="flex  h-auto w-full bg-transparent gap-1 p-0">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={[
                    "w-full justify-start gap-2.5 px-3 py-2.5 text-sm rounded-lg",
                    "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none",
                    "hover:bg-muted transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  ].join(" ")}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
         

          {/* Tab panels */}
          <main className="flex-1 min-w-0">
            <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
              <ProfileTab user={user} />
            </TabsContent>

            <TabsContent value="account" className="mt-0 focus-visible:outline-none">
              <AccountTab user={user} />
            </TabsContent>

            <TabsContent value="preferences" className="mt-0 focus-visible:outline-none">
              <PreferencesTab />
            </TabsContent>

            <TabsContent value="privacy" className="mt-0 focus-visible:outline-none">
              <PrivacyTab />
            </TabsContent>
          </main>
        </Tabs>
      </div>
    </div>
  );
}
