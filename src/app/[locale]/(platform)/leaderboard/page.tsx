import { useTranslations } from "next-intl";

export default function Leaderboard() {
  const t = useTranslations("Navigation");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{t("leaderboard")}</h1>
      <p className="mt-4 text-gray-600">Top learners on the platform.</p>
    </div>
  );
}
