"use client";

import { memo } from "react";
import type { UserCourseProgress } from "@/lib/data/courses";
import { CourseCard } from "./CourseCard";

interface CourseGridProps {
  courses: any[];
  userProgress?: UserCourseProgress[];
}

export const CourseGrid = memo(function CourseGrid({
  courses,
  userProgress = [],
}: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed rounded-xl bg-card/50">
        <p className="text-lg font-medium">
          No courses found matching your criteria.
        </p>
        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const progress = userProgress.find((p) => p.courseId === course._id);
        return (
          <CourseCard
            key={course._id}
            course={course}
            progressPercentage={progress?.progressPercentage}
          />
        );
      })}
    </div>
  );
});
