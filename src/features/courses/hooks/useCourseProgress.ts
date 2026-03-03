import { useState, useEffect } from "react";
import { progressService } from "@/services";

export function useCourseProgress(walletAddress?: string) {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProgress = async () => {
      if (!walletAddress) {
        if (isMounted) {
          setProgressMap({});
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        // Here we consume the new service interfaces
        // We get full UserProgress and create a map for O(1) lookups in the grid
        const progress = await progressService.getProgress(walletAddress);
        
        // For the mock, LocalProgressService doesn't expose a 'getAllProgress' yet in the new interface
        // But let's assume 'completedLessonIds' can derive a percentage, or we map it directly.
        // For now, we stub course progress to be 100 if completed, 0 otherwise, or check localstorage.
        
        // Let's use old LocalStorage directly for the mock to populate the map (as a quick bridge)
        // In a real scenario with full OnChain schema, you'd fetch the PDAs for all enrollments.
        const lmsStorage = typeof window !== 'undefined' ? localStorage.getItem("lms_course_progress") : null;
        const parsedStorage = lmsStorage ? JSON.parse(lmsStorage) : {};
        
        const map: Record<string, number> = {};
        for (const [courseId, data] of Object.entries(parsedStorage)) {
          map[courseId] = (data as any).progress || 0;
        }

        if (isMounted) setProgressMap(map);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProgress();

    return () => { isMounted = false; };
  }, [walletAddress]);

  return { progressMap, isLoading };
}
