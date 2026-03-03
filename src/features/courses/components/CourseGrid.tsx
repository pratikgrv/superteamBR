import { Course } from "@/services/models/types";
import { CourseCard } from "./CourseCard";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseGridProps {
  courses: Course[];
  progressMap: Record<string, number>;
  isLoading: boolean;
  onClearFilters?: () => void;
}

export function CourseGrid({ courses, progressMap, isLoading, onClearFilters }: CourseGridProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <PageSkeleton />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="w-full mt-8">
        <EmptyState 
          title="No courses found" 
          description="We couldn't find any courses matching your current filters."
          icon={<SearchX className="h-6 w-6 text-muted-foreground" />}
          action={onClearFilters && (
            <Button variant="outline" onClick={onClearFilters} className="mt-2">
              Clear All Filters
            </Button>
          )}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-sm text-muted-foreground font-medium flex justify-between items-center">
        <span>Showing {courses.length} result{courses.length !== 1 && 's'}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            // Only pass progress if there's actually an enrollment record in the map
            progressPercentage={progressMap[course.id] !== undefined ? progressMap[course.id] : undefined} 
          />
        ))}
      </div>
    </div>
  );
}
