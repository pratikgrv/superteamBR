import { useTranslations } from "next-intl";
import { CourseCatalog } from "@/components/course/CourseCatalog";
import { LearningPaths } from "@/components/course/LearningPaths";
import { mockUserProgress } from "@/lib/data/courses";
import { client } from "@/sanity/lib/client";
import { ALL_COURSES_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function Courses() {
  // We can't use `useTranslations` in a server component in the same way,
  // but next-intl supports server-side translations. Using a fallback for now.

  // Fetch from sanity
  const courses = await client.fetch(ALL_COURSES_QUERY);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
      <div className="flex flex-col mb-8 gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Courses</h1>
        <p className="text-xl text-muted-foreground">
          Master Solana development with comprehensive courses and tutorials.
        </p>
      </div>

      <LearningPaths />

      <CourseCatalog courses={courses} userProgress={mockUserProgress} />
    </div>
  );
}
