import React from 'react'
import LoginContent from '@/features/auth/LoginContent'
import { auth } from '@/lib/auth/auth'
import { getLocale } from 'next-intl/server'
import { headers } from 'next/headers'
import { redirect } from '@/i18n/routing'

const LoginPage = async () => {

  const session = await auth.api.getSession({ headers: await headers() });
  const locale = await getLocale();
  
  if (session?.user) {
    return redirect({ href: '/', locale });
  }
 
  return (
    <LoginContent />
  )
}

export default LoginPage