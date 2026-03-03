import React from 'react'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { SiteHeader } from '@/components/layout/SiteHeader'
import  SiteFooter  from '@/components/layout/SiteFooter'

const ProtectedLayout = async ({children}: {children: React.ReactNode}) => {
 
 
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
    <>
    <SiteHeader user={session?.user} />
    {children}
    <SiteFooter />
    </>
  )
}

export default ProtectedLayout