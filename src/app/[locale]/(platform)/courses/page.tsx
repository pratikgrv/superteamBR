"use client";

import { useCourses } from "@/features/courses/hooks/useCourses";
import { useCourseProgress } from "@/features/courses/hooks/useCourseProgress";
import { CourseFilters } from "@/features/courses/components/CourseFilters";
import { CourseGrid } from "@/features/courses/components/CourseGrid";
import { useWallet } from "@solana/wallet-adapter-react";

export default function CoursesPage() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const { courses, isLoading: coursesLoading, filters, setFilter, clearFilters, error } = useCourses();
  const { progressMap, isLoading: progressLoading } = useCourseProgress(walletAddress);

  const isLoading = coursesLoading || progressLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Explore Courses & Paths</h1>
        <p className="text-muted-foreground text-lg">
          Master Solana by building real-world projects and earning on-chain credentials.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <CourseFilters 
              filters={filters} 
              setFilter={setFilter} 
              clearFilters={clearFilters} 
            />
          </div>
        </div>

        {/* Course Grid Area */}
        <div className="flex-1">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <CourseGrid 
            courses={courses} 
            progressMap={progressMap} 
            isLoading={isLoading} 
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
}
