"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/authClient";

import { UserProgress, Course } from "@/services/models/types";
import { SanityService } from "@/lib/services/sanity.service";
import { progressService } from "@/services";

export interface ActivityItem {
  id: string;
  type: "COURSE_COMPLETED" | "LESSON_COMPLETED" | "CREDENTIAL_CLAIMED" | "ACHIEVEMENT_UNLOCKED";
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
  link?: string;
}

export interface DashboardData {
  progress: UserProgress | null;
  enrolledCourses: (Course & { progressPercentage: number; enrolledAt: string })[];
  recommendedCourses: Course[];
  recentActivity: ActivityItem[];
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState<Omit<DashboardData, "isLoading" | "error">>({
    progress: null,
    enrolledCourses: [],
    recommendedCourses: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      if (isPending) return;
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userId = session.user.id;
        
        // 1. Fetch User Progress 
        const progress = await progressService.getProgress(userId);
        
        // 2. Fetch All Courses to map enrollments and recommendations
        const allCourses = await SanityService.getAllCourses();

        // 3. Map Enrolled Courses
        const enrolledCourses = progress.enrollments.map(enrollment => {
          const course = allCourses.find(c => c.id === enrollment.courseId);
          return course ? {
            ...course,
            progressPercentage: enrollment.progressPercentage,
            enrolledAt: enrollment.enrolledAt
          } : null;
        }).filter((c): c is NonNullable<typeof c> => c !== null);

        // 4. Determine Recommended Courses (Mock logic: just grab top 3 not enrolled)
        const enrolledIds = new Set(progress.enrollments.map(e => e.courseId));
        const recommendedCourses = allCourses
          .filter(c => !enrolledIds.has(c.id))
          .slice(0, 3);

        // 5. Mock Recent Activity Feed (since it's not fully in the backend yet)
        const recentActivity: ActivityItem[] = [
          {
            id: "act-1",
            type: "LESSON_COMPLETED",
            title: "Completed Lesson: Intro to Waitlists",
            description: "You successfully completed the lesson inside Build a Web3 Waitlist.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            xpEarned: 50,
          },
          {
            id: "act-2",
            type: "ACHIEVEMENT_UNLOCKED",
            title: "Unlocked Badge: Solana Starter",
            description: "You began your journey into Solana development.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            xpEarned: 100,
          },
          {
            id: "act-3",
            type: "COURSE_COMPLETED",
            title: "Finished Course: Intro to Solana",
            description: "You mastered the basics of Solana development.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
            xpEarned: 500,
            link: "/courses/intro-to-solana"
          }
        ];

        setData({
          progress,
          enrolledCourses,
          recommendedCourses,
          recentActivity
        });

      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, [session?.user?.id, isPending]);

  return { ...data, isLoading, error };
}
