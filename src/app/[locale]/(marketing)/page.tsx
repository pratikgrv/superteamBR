import LoginPage from "@/components/LoginModal";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";

type Props = {
	params: Promise<{ locale: string }>;
};

const Home = async ({ params }: Props) => {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (session?.user) {
		redirect({ href: "/settings", locale });
	}

	return <LoginPage />;
};

export default Home;
