"use client";

import { Course } from "@/services/models/types";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { Sparkles } from "lucide-react";

interface RecommendedCoursesProps {
  courses: Course[];
}

export function RecommendedCourses({ courses }: RecommendedCoursesProps) {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold tracking-tight">Recommended for You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
           <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
