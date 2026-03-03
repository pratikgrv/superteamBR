import { redirect } from '@/i18n/routing';
import { auth } from '@/lib/auth/auth';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';

const AdminLayout =async ({children}: {children: React.ReactNode}) => {

  const session = await auth.api.getSession({ headers: await headers() });
  const locale = await getLocale();

  
  if (!session?.user) {
    return redirect({ href: '/login', locale });
  }
  if(session.user.role !== "admin") {
    return redirect({ href: '/login', locale });
  }
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}

export default AdminLayout