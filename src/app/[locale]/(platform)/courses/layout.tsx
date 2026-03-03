import { SiteHeader } from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export default async function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={session?.user} />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
