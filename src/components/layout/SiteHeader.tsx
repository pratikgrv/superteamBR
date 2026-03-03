"use client";

import { useState } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { 
  Search, Flame, Zap, Bell, TerminalSquare, Menu, 
  ChevronDown, User as UserIcon, LogOut, Settings, Globe,
  Sun, Moon, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocale } from "next-intl";
import { User } from "better-auth/client";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { useTheme } from "next-themes";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Loader2 } from "lucide-react";


interface ClientHeaderProps {

  user?: User ;
  currentStreak?: number;
  xpBalance?: string;
}

export function SiteHeader({
 
  user,
  currentStreak = 14,
  xpBalance = "2,450",
}: ClientHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();
  const { progress, isLoading } = useUserProgress(walletAddress);

  const displayStreak = progress?.streakDays ?? currentStreak;
  const displayXp = progress?.totalXp?.toLocaleString() ?? xpBalance;
  
  const locale = useLocale();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Courses", href: "/courses" },
  ];

  const exploreCategories = [
    { name: "Solidity Developer", href: "/courses/solidity" },
    { name: "DeFi Mastery", href: "/courses/defi" },
    { name: "NFT Creator", href: "/courses/nft" },
  ];

  const locales = [
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "es", name: "Español" },
  ];

  return (
    <header className="h-16 flex items-center justify-between w-full px-4 md:px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center gap-4 md:gap-8">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold tracking-tight text-foreground uppercase flex items-center gap-2">
          <TerminalSquare className="w-6 h-6 text-primary" strokeWidth={1.5} />
          <span className="hidden sm:inline tracking-tighter">W3LEARN</span>
          <span className="sm:hidden tracking-tighter">W3L</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Explore Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-3 py-1.5 h-9 text-sm font-medium text-foreground gap-1">
                Explore <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Learning Paths</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {exploreCategories.map((cat, idx) => (
                  <DropdownMenuItem key={idx} asChild>
                    <Link href={cat.href} className="cursor-pointer font-medium">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/courses" className="cursor-pointer w-full font-bold text-primary justify-center">
                  View All Courses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Other Nav Links */}
          {navLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href} 
              className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar (Desktop) */}
        <div className="hidden lg:block relative w-64">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center w-full h-9 rounded-md border border-input bg-muted/50 px-3 ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:border-primary transition-colors">
              <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search courses..."
                className="flex h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="hidden xl:flex items-center justify-center shrink-0 text-[10px] text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5 ml-2 h-5">
                <span className="leading-none">⌘K</span>
              </div>
            </div>
          </form>
        </div>

        {/* User Stats & Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {user && (
            <>
              {/* Gamification Stats */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 h-8 bg-muted border rounded-full hover:bg-accent transition-colors" title="Current Streak">
                <Flame className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
                <span className="text-sm font-bold text-foreground">
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : displayStreak}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 h-8 bg-muted border rounded-full hover:bg-accent transition-colors" title="XP Balance">
                <Zap className="w-4 h-4 text-yellow-500" strokeWidth={2.5} />
                <span className="text-sm font-bold text-foreground">
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : displayXp}
                </span>
              </div>
              
              <button className="relative w-8 h-8 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center mx-1">
                <Bell className="w-4 h-4" strokeWidth={2} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border border-background"></span>
              </button>
            </>
          )}

          {/* Theme Switcher (Desktop) */}
          <ThemeSwitcher />

          {/* Lang Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hidden sm:flex text-muted-foreground" title="Switch Language">
                <Globe className="w-4 h-4" />
                <span className="sr-only">Switch Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {locales.map((l) => (
                <DropdownMenuItem 
                  key={l.code} 
                  className={`cursor-pointer ${locale === l.code ? "bg-muted font-bold" : ""}`}
                  onClick={() => router.replace(pathname, { locale: l.code })}
                >
                  {l.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 ml-1 rounded-full bg-surface-alt flex flex-shrink-0 items-center justify-center text-primary font-bold text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring border border-transparent hover:border-primary/50 transition-all overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name || "UserAvatar"} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.substring(0, 2).toUpperCase() || "U"
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium">{user.name}</p>}
                    {user.email && <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/auth/signout" className="cursor-pointer w-full flex items-center text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Navigation (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden ml-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-6 flex flex-col h-full">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="flex items-center gap-2 text-xl tracking-tighter">
                  <TerminalSquare className="w-5 h-5 text-primary" strokeWidth={2} />
                  W3LEARN
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative flex items-center w-full h-10 rounded-md border border-input bg-muted/50 px-3">
                    <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="flex h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                {/* Mobile Links */}
                <div className="flex flex-col space-y-1">
                  <h4 className="font-semibold text-sm text-foreground mb-1 uppercase tracking-wider">Explore</h4>
                  {exploreCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href={cat.href}
                      className="text-sm py-2 px-3 -mx-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                      href="/courses"
                      className="text-sm py-2 px-3 -mx-3 rounded-md text-primary font-bold hover:bg-muted transition-colors"
                  >
                     Browse All Courses
                  </Link>
                </div>
                
                <div className="flex flex-col space-y-1 pt-2 border-t border-border">
                  <h4 className="font-semibold text-sm text-foreground mb-1 uppercase tracking-wider">Navigation</h4>
                  {navLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="text-sm py-2 px-3 -mx-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border mt-auto flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Theme</span>
                  <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                    {[
                      { name: 'light', icon: Sun },
                      { name: 'dark', icon: Moon },
                      { name: 'system', icon: Monitor }
                    ].map((t) => {
                      const { theme, setTheme } = useTheme();
                      const Icon = t.icon;
                      const isActive = theme === t.name;
                      return (
                        <button
                          key={t.name}
                          onClick={() => setTheme(t.name)}
                          className={`p-1.5 rounded-md transition-all ${isActive ? "bg-background text-primary shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"}`}
                          title={`Switch to ${t.name} theme`}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                   <span className="text-muted-foreground">Language</span>
                   <div className="flex gap-2">
                     {locales.map((l) => (
                       <button
                         key={l.code}
                         onClick={() => router.replace(pathname, { locale: l.code })}
                         className={`px-2 py-1 rounded-md transition-colors ${locale === l.code ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"}`}
                       >
                         {l.code.toUpperCase()}
                       </button>
                     ))}
                   </div>
                </div>
                {!user && (
                   <Link
                     href="/login"
                     className="flex items-center justify-center w-full rounded-md text-sm font-bold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10"
                   >
                     Sign In
                   </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

