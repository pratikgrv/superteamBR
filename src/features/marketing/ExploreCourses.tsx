import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { courseService } from '@/services';
import { CourseCard } from './CourseCard';

export default async function ExploreCourses() {
  const t = await getTranslations('Index');
  const allCourses = await courseService.getCourses();
  
  // Display only top 6 courses on landing page
  const displayCourses = allCourses.slice(0, 6);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Featured Courses
            </h2>
            <p className="text-muted-foreground">
              Deep dive into the Solana ecosystem with guided projects and expert-led curriculum.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
