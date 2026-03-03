"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Globe, Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

type Theme = "light" | "dark" | "system";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
];

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="w-4 h-4" aria-hidden="true" /> },
  { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" aria-hidden="true" /> },
  { value: "system", label: "System", icon: <Monitor className="w-4 h-4" aria-hidden="true" /> },
];

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

export function PreferencesTab() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState<Theme>("system");
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "notif-email-course",
      label: "Course updates",
      description: "New lessons, quizzes, or content added to enrolled courses",
      checked: true,
    },
    {
      id: "notif-email-achievement",
      label: "Achievement unlocked",
      description: "When you earn a new badge or reach a milestone",
      checked: true,
    },
    {
      id: "notif-email-streak",
      label: "Streak reminders",
      description: "Daily reminder to keep your learning streak alive",
      checked: false,
    },
    {
      id: "notif-email-newsletter",
      label: "Newsletter",
      description: "Monthly digest of platform news and featured courses",
      checked: false,
    },
    {
      id: "notif-push-lesson",
      label: "Lesson reminders (push)",
      description: "Browser push notification to resume your last lesson",
      checked: false,
    },
  ]);

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, checked: !n.checked } : n))
    );
  }

  async function handleSave() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
    toast.success("Preferences saved");
  }

  return (
    <div className="space-y-6">
      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" aria-hidden="true" />
            Language
          </CardTitle>
          <CardDescription>Select the language for the platform interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <label htmlFor="pref-language" className="text-sm font-medium">
              Interface Language
            </label>
            <select
              id="pref-language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Choose how the platform looks on your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <fieldset>
            <legend className="text-sm font-medium mb-3">Theme</legend>
            <div className="flex flex-wrap gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  role="radio"
                  aria-checked={theme === t.value}
                  onClick={() => setTheme(t.value)}
                  className={[
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    theme === t.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted text-foreground",
                  ].join(" ")}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" aria-hidden="true" />
            Notifications
          </CardTitle>
          <CardDescription>Control which notifications you receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4" aria-label="Notification preferences">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3">
                <Checkbox
                  id={n.id}
                  checked={n.checked}
                  onCheckedChange={() => toggleNotification(n.id)}
                  className="mt-0.5 shrink-0"
                />
                <label htmlFor={n.id} className="cursor-pointer select-none">
                  <span className="text-sm font-medium">{n.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                </label>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[140px]">
          {isSaving ? "Saving…" : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
