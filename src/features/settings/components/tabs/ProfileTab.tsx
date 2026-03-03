"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, Github, Globe, Twitter, User } from "lucide-react";
import { toast } from "sonner";

interface ProfileTabProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSave() {
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success("Profile saved successfully");
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Picture</CardTitle>
          <CardDescription>Update your avatar. JPG, PNG or GIF&nbsp;• Max&nbsp;5&nbsp;MB</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-5">
          <div className="relative shrink-0">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Your avatar"
                width={72}
                height={72}
                className="w-18 h-18 rounded-full object-cover border border-border"
              />
            ) : (
              <div
                className="w-[72px] h-[72px] rounded-full bg-primary/10 border border-border flex items-center justify-center text-primary font-bold text-xl select-none"
                aria-label="Avatar placeholder"
              >
                {initials}
              </div>
            )}
            <button
              type="button"
              aria-label="Upload new avatar"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none transition-colors"
            >
              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-1.5">
            <Button variant="outline" size="sm">
              Upload Photo
            </Button>
            <p className="text-xs text-muted-foreground">
              Avatar changes are reflected across the platform.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
          <CardDescription>Update your display name and bio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="settings-name" className="text-sm font-medium">
              Display Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="settings-name"
                name="name"
                type="text"
                placeholder="Your full name…"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-bio" className="text-sm font-medium">
              Bio
              <span className="text-muted-foreground font-normal ml-1 text-xs">(optional)</span>
            </label>
            <textarea
              id="settings-bio"
              name="bio"
              placeholder="Tell others a little about yourself…"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Links</CardTitle>
          <CardDescription>Add your social profiles so others can connect with you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="settings-twitter" className="text-sm font-medium flex items-center gap-1.5">
              <Twitter className="w-4 h-4" aria-hidden="true" /> Twitter / X
            </label>
            <Input
              id="settings-twitter"
              name="twitter"
              type="url"
              placeholder="https://x.com/yourhandle…"
              autoComplete="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-github" className="text-sm font-medium flex items-center gap-1.5">
              <Github className="w-4 h-4" aria-hidden="true" /> GitHub
            </label>
            <Input
              id="settings-github"
              name="github"
              type="url"
              placeholder="https://github.com/username…"
              autoComplete="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-website" className="text-sm font-medium flex items-center gap-1.5">
              <Globe className="w-4 h-4" aria-hidden="true" /> Website
            </label>
            <Input
              id="settings-website"
              name="website"
              type="url"
              placeholder="https://yourwebsite.com…"
              autoComplete="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? "Saving…" : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
