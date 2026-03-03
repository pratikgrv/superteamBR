import { ArrowRight, Code, Database, Globe, Layers, Layout, Shield, Terminal } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { courseService } from '@/services';

const ICON_MAP: Record<string, any> = {
  'Development': Code,
  'Design': Layout,
  'Blockchain': Layers,
  'Web3': Globe,
  'Security': Shield,
  'Database': Database,
  'Frontend': Layout,
  'Backend': Terminal,
};

export default async function ExploreCategories() {
  const t = await getTranslations('Index');
  const courses = await courseService.getCourses();
  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean))) as string[];
  
  // Display only a few cards as requested
  const displayCategories = categories.slice(0, 8);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Find exactly what you want to learn. From blockchain fundamentals to advanced smart contract development.
            </p>
          </div>
          <Link 
            href="/courses" 
            className="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            View All Courses
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((category) => {
            const Icon = ICON_MAP[category] || Layers;
            return (
              <Link
                key={category}
                href={`/courses?category=${encodeURIComponent(category)}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-xl bg-card border hover:border-primary/50 hover:bg-accent/10 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                  <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                  {category}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
