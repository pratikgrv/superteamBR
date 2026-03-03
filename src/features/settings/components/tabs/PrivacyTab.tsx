"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type Visibility = "public" | "private" | "friends";

interface VisibilityOption {
  value: Visibility;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const VISIBILITY_OPTIONS: VisibilityOption[] = [
  {
    value: "public",
    label: "Public",
    description: "Anyone on the platform can view your profile, progress, and achievements.",
    icon: <Eye className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "friends",
    label: "Connections Only",
    description: "Only users you follow or who follow you can see your profile.",
    icon: <ShieldCheck className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "private",
    label: "Private",
    description: "Your profile is hidden. Only you can see your data.",
    icon: <EyeOff className="w-4 h-4" aria-hidden="true" />,
  },
];

export function PrivacyTab() {
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
    toast.success("Privacy settings saved");
  }

  async function handleExport() {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsExporting(false);
    toast.success("Your data export is being prepared. You'll receive an email when it's ready.");
  }

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-4 h-4" aria-hidden="true" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control who can discover and view your learner profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fieldset>
            <legend className="sr-only">Profile visibility options</legend>
            <div className="space-y-3" role="radiogroup">
              {VISIBILITY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`visibility-${opt.value}`}
                  className={[
                    "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    visibility === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    id={`visibility-${opt.value}`}
                    name="visibility"
                    value={opt.value}
                    checked={visibility === opt.value}
                    onChange={() => setVisibility(opt.value)}
                    className="sr-only"
                  />
                  <div
                    className={[
                      "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                      visibility === opt.value
                        ? "border-primary"
                        : "border-muted-foreground",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {visibility === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{opt.label}</span>
                      {opt.value === "public" && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                  <span
                    className={visibility === opt.value ? "text-primary" : "text-muted-foreground"}
                  >
                    {opt.icon}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      {/* Activity Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Sharing</CardTitle>
          <CardDescription>Choose what activity data is shared publicly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: "share-progress", label: "Course progress", sub: "Show which courses you're enrolled in and % completed" },
            { id: "share-achievements", label: "Achievements", sub: "Show earned badges and certificates on your public profile" },
            { id: "share-streak", label: "Streak data", sub: "Show your current and longest learning streaks" },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <label htmlFor={item.id} className="cursor-pointer">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </label>
              <input
                type="checkbox"
                id={item.id}
                defaultChecked
                className="w-4 h-4 rounded border-input accent-primary"
                aria-describedby={`${item.id}-desc`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-4 h-4" aria-hidden="true" />
            Data Export
          </CardTitle>
          <CardDescription>
            Download a copy of your personal data in JSON format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Your export will include: profile info, course progress, achievements, and activity history.
            Exports are available every 30&nbsp;days.
          </p>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            {isExporting ? "Preparing Export…" : "Request Data Export"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[140px]">
          {isSaving ? "Saving…" : "Save Privacy Settings"}
        </Button>
      </div>
    </div>
  );
}
