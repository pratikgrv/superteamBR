import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { courseService } from "@/services";
import { Course, CourseFilterArgs, CourseDifficulty } from "@/services/models/types";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse filters from URL
  const search = searchParams.get("search") || "";
  const difficulty = searchParams.getAll("difficulty") as CourseDifficulty[];
  const duration = searchParams.getAll("duration");
  const category = searchParams.getAll("category");

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const filterArgs: CourseFilterArgs = {
          search: search || undefined,
          difficulty: difficulty.length > 0 ? difficulty : undefined,
          duration: duration.length > 0 ? duration : undefined,
          category: category.length > 0 ? category : undefined,
        };
        const fetched = await courseService.getCourses(filterArgs);
        if (isMounted) {
          setCourses(fetched);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to fetch courses");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCourses();
    return () => { isMounted = false; };
  }, [search, searchParams]); // Re-fetch when URL changes

  // Helper to update URL params
  const setFilter = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear existing for this key
    params.delete(key);
    
    // Append new values
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return { 
    courses, 
    isLoading, 
    error,
    filters: { search, difficulty, duration, category },
    setFilter,
    clearFilters
  };
}
