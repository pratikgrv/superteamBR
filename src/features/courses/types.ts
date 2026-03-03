import { CourseDifficulty } from "@/lib/services/sanity.service";

// Define the shape of our filters as used in the UI
export interface CourseFiltersUI {
  search: string;
  difficulty: CourseDifficulty[];
  duration: string[];
  category: string[];
}

export interface EnrolledCourseData {
  courseId: string;
  progressPercentage: number;
}
