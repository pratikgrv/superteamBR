import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DashboardContent } from "./DashboardContent";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });
  return {
    title: `Dashboard - ${t("Platform.name")}`,
    description: "Track your Solana learning progress",
  };
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
