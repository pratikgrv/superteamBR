"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/lib/data/courses";
import { type CourseFilterState, CourseFilters } from "./CourseFilters";
import { CourseGrid } from "./CourseGrid";

interface CourseCatalogProps {
  courses: any[];
  userProgress: any[];
}

export function CourseCatalog({ courses, userProgress }: CourseCatalogProps) {
  const [filters, setFilters] = useState<CourseFilterState>({
    search: "",
    difficulty: "All",
    topic: "All",
  });

  // Extract unique topics for the filter dropdown
  const availableTopics = useMemo(() => {
    const topics = new Set<string>();
    courses.forEach((course) => {
      course.topics?.forEach((topic: string) => topics.add(topic));
    });
    return Array.from(topics).sort();
  }, [courses]);

  // Filter courses based on state
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // 1. Search Filter
      if (
        filters.search &&
        !course.title.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      // 2. Difficulty Filter
      if (
        filters.difficulty !== "All" &&
        course.difficulty !== filters.difficulty
      ) {
        return false;
      }
      // 3. Topic Filter
      if (filters.topic !== "All" && !course.topics?.includes(filters.topic)) {
        return false;
      }
      return true;
    });
  }, [courses, filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">All Courses</h2>
        <p className="text-muted-foreground text-sm">
          Find exactly what you want to learn next.
        </p>
      </div>

      <CourseFilters
        filters={filters}
        onFilterChange={setFilters}
        availableTopics={availableTopics}
      />

      <div className="pt-4">
        <CourseGrid courses={filteredCourses} userProgress={userProgress} />
      </div>
    </div>
  );
}
