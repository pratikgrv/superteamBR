import { useTranslations } from "next-intl";

export default function Dashboard() {
	const t = useTranslations("Navigation");
	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold">{t("dashboard")}</h1>
			<p className="mt-4 text-gray-600">
				Welcome back! Here is your learning progress.
			</p>
		</div>
	);
}
