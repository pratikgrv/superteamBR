import { useTranslations } from "next-intl";

export default function Courses() {
	const t = useTranslations("Navigation");
	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold">{t("courses")}</h1>
			<p className="mt-4 text-gray-600">Explore learning paths.</p>
		</div>
	);
}
