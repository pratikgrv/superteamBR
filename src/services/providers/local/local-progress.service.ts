import { ILearningProgressService } from '../../interfaces/learning-progress.service';
import { UserProgress } from '../../models/types';

const STORAGE_KEY = "lms_course_progress";

// Basic wrapper around local storage logic for the new interface
export class LocalProgressService implements ILearningProgressService {
  private getStorage(): Record<string, any> {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  async getProgress(walletAddress: string): Promise<UserProgress> {
    const storage = this.getStorage();
    const demoProgress = storage["demo-course-id"]?.progress ?? null;
    
    // Convert local storage mapping into the new CourseEnrollment array 
    const enrollments = Object.entries(storage).map(([courseId, data]: [string, any]) => ({
      courseId,
      progressPercentage: data.progress || 0,
      enrolledAt: data.enrolledAt || new Date().toISOString(),
      completedAt: data.progress >= 100 ? (data.completedAt || new Date().toISOString()) : undefined,
      credentialClaimed: !!data.credentialClaimed
    }));

    return {
      walletAddress,
      totalXp: 1250, // Mock XP
      level: Math.floor(Math.sqrt(1250 / 100)),
      completedLessonIds: demoProgress ? ['lesson-1'] : [],
      streakDays: 14, // Mock streak
      enrollments
    };
  }

  async completeLesson(walletAddress: string, courseSlug: string, lessonId: string) {
    if (typeof window !== "undefined") {
      const storage = this.getStorage();
      if (storage[courseSlug]) {
        storage[courseSlug].progress = 100;
        storage[courseSlug].completedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      }
    }
    return { success: true, newXpLevel: 1350 };
  }

  async enrollCourse(walletAddress: string, courseId: string) {
    if (typeof window !== "undefined") {
      const storage = this.getStorage();
      if (!storage[courseId]) {
        storage[courseId] = { 
          progress: 0, 
          enrolledAt: new Date().toISOString(),
          credentialClaimed: false
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      }
    }
    return true;
  }

  async closeEnrollment(walletAddress: string, courseId: string) {
    if (typeof window !== "undefined") {
      const storage = this.getStorage();
      if (storage[courseId]) {
        delete storage[courseId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      }
    }
    return true;
  }

  async claimCredential(walletAddress: string, courseId: string) {
    if (typeof window !== "undefined") {
      const storage = this.getStorage();
      if (storage[courseId]) {
        storage[courseId].credentialClaimed = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      }
    }
    return { success: true, signature: "mock-tx-signature-123" };
  }

  async getLeaderboard(timeframe: 'weekly' | 'monthly' | 'all-time'): Promise<UserProgress[]> {
    return [
      {
        walletAddress: "E91...3aQ",
        totalXp: 4500,
        level: Math.floor(Math.sqrt(4500 / 100)),
        completedLessonIds: [],
        streakDays: 45,
        enrollments: []
      },
      {
        walletAddress: "7x2...9bP",
        totalXp: 3200,
        level: Math.floor(Math.sqrt(3200 / 100)),
        completedLessonIds: [],
        streakDays: 21,
        enrollments: []
      },
      {
        walletAddress: "YourWallet",
        totalXp: 1250,
        level: Math.floor(Math.sqrt(1250 / 100)),
        completedLessonIds: [],
        streakDays: 14,
        enrollments: []
      }
    ];
  }
}
