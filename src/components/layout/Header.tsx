import { headers } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/ThemeToggle";
// Assuming there might be a LanguageSwitcher we can add later.
import { auth } from "@/lib/auth/server";

export async function Header({ locale }: { locale: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const t = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            {/* Placeholder for Superteam BR Logo */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                BR
              </span>
            </div>
            <span className="inline-block font-bold text-lg text-foreground">
              Superteam Brasil
            </span>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex gap-6">
            <Link
              href={`/${locale}#features`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("features") || "Features"}
            </Link>
            <Link
              href={`/${locale}/courses`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("courses") || "Courses"}
            </Link>
            <Link
              href={`/${locale}/community`}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("community") || "Community"}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Auth Buttons */}
          {session?.user ? (
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href={`/${locale}/login`} // Adjust path to trigger LoginModal
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              {t("login") || "Log In"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
