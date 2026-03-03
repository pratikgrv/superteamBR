import { useState, useEffect } from "react";
import { SanityService, Course } from "@/lib/services/sanity.service";

export function useCourseDetail(slug: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const fetched = await SanityService.getCourseBySlug(slug);
        if (isMounted) {
          setCourse(fetched);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to fetch course details");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (slug) fetchCourse();
    
    return () => { isMounted = false; };
  }, [slug]);

  return { course, isLoading, error };
}
