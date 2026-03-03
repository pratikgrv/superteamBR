import SiteFooter from '@/components/layout/SiteFooter';

import Testimonials from '@/features/marketing/Testimonials';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Features from '@/features/marketing/Features';
import PartnerLogos from '@/features/marketing/PartnerLogos';
import ExploreCategories from '@/features/marketing/ExploreCategories';
import ExploreCourses from '@/features/marketing/ExploreCourses';
import { Play } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export default async function Home() {
  const t = await getTranslations('Index');
  const session = await auth.api.getSession(
    {
      headers: await headers(),
    }
  );
  return (
    <main className="flex min-h-screen flex-col items-center">
      <SiteHeader user={session?.user} />
      
      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 border-b bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Content Side */}
            <div className="flex flex-col text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl mb-6 leading-tight">
                Master Web3, <br className="hidden sm:block" />
                <span className="text-primary italic">Blockchain</span> & Smart Contracts
              </h1>

              <p className="text-xl leading-relaxed text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0">
                Learn by building real world dApps and earning on-chain credentials. Join thousands of developers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-full font-bold">
                  <Link href="/courses">Explore Learning Paths</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full font-bold">
                  <Link href="/login">Sign Up Free</Link>
                </Button>
              </div>
            </div>

            {/* Media Side */}
            <div className="w-full">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted border p-2 ring-1 ring-border shadow-soft flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative z-10 h-24 w-24 rounded-full bg-background/80 backdrop-blur-sm shadow-xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-10 w-10 text-primary ml-1 fill-current" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
{/* explore categories -> need to fetch from sanity and show in small cards*/}
<ExploreCategories />

{/* explore courses-> need to fetch from sanity and show in grid */}
<ExploreCourses />
{/* but for course page need to get user enrolled course and show in grid */}
     {/*  */}
       <PartnerLogos />
      <Features />
      <Testimonials />
      <SiteFooter />
      
        
      
    </main>
  );
}
