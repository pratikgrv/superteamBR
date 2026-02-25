import { headers } from "next/headers";
import { Features } from "@/components/layout/Features";
import { Hero } from "@/components/layout/Hero";
import { LearningPaths } from "@/components/layout/LearningPaths";
import { SocialProof } from "@/components/layout/SocialProof";
import { redirect } from "@/lib/i18n/routing";
import { auth } from "@/lib/auth/server";

type Props = {
	params: Promise<{ locale: string }>;
};

const Home = async ({ params }: Props) => {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (session?.user) {
		redirect({ href: "/settings", locale });
	}

	return (
		<>
			<Hero locale={locale} />
			<SocialProof />
			<LearningPaths />
			<Features />
		</>
	);
};

export default Home;
