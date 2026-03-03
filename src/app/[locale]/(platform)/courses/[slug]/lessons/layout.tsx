import { notFound } from "next/navigation";
import { SanityService } from "@/lib/services/sanity.service";
import { LessonSidebar } from "@/features/lesson/components/LessonSidebar";
import { LessonMobileHeader } from "@/features/lesson/components/LessonMobileHeader";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await SanityService.getCourseBySlug(slug);

  if (!course) {
    return notFound();
  }

  // TODO: Fetch user progress from progressService to map rawLessonFlags string
  // For now using empty string. This will be dynamically fetched later.
  const rawLessonFlags = "";

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Mobile Header Breadcrumb (Hidden on Desktop) */}
      <LessonMobileHeader course={course} rawLessonFlags={rawLessonFlags} />
      
      <div className="flex flex-1 relative">
        {/* Fixed Desktop Sidebar */}
        <LessonSidebar course={course} rawLessonFlags={rawLessonFlags} />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full lg:pl-80">
          {children}
        </main>
      </div>
    </div>
  );
}
