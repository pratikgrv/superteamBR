export interface Instructor {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface TestCase {
  id: string;
  description: string;
  requiredPattern?: string; // Regex to check if code passes
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string; // Markdown or rich text
  initialCode?: string; // Starter code for the editor
  durationMinutes: number;
  videoUrl?: string;
  xpReward: number;
  testCases?: TestCase[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export type CourseDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: CourseDifficulty;
  topics: string[];
  instructor: Instructor;
  modules: Module[];
  reviews: Review[];
  totalDurationMinutes: number;
  totalXp: number;
  category?: string;
}

export interface CourseEnrollment {
  courseId: string;
  enrolledAt: string; // ISO date string
  progressPercentage: number;
  completedAt?: string; // ISO date string if finished
  credentialClaimed: boolean;
}

export interface UserProgress {
  walletAddress: string;
  totalXp: number;
  level: number;
  completedLessonIds: string[];
  streakDays: number;
  enrollments: CourseEnrollment[]; // Advanced course-specific state
}
export interface CourseFilterArgs {
  search?: string; // name
  slug?: string;
  difficulty?: (string | number)[];
  topic?: string[];
  trackId?: string;
  category?: string[];
  duration?: string[]; // "< 2h", "2h - 5h", "> 5h"
}
