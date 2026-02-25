import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen flex-col relative w-full overflow-x-hidden">
      <Header locale={locale} />
      <main className="flex-1 w-full">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
