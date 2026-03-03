import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { SettingsPage } from "@/features/settings/components/SettingsPage";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale });
  return {
    title: `Settings - ${t("Platform.name")}`,
    description: "Manage your profile, account, preferences, and privacy.",
  };
}

export default async function SettingsRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SettingsPage
      user={
        session?.user
          ? {
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
            }
          : undefined
      }
    />
  );
}
