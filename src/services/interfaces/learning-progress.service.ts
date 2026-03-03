import { UserProgress } from '../models/types';

export interface ILearningProgressService {
  /** Gets the overall progress and XP for a user */
  getProgress(walletAddress: string): Promise<UserProgress>;
  
  /** Marks a lesson as complete, rewarding XP */
  completeLesson(walletAddress: string, courseSlug: string, lessonId: string): Promise<{ success: boolean; newXpLevel: number; error?: string }>;
  
  /** Enrolls a user in a course */
  enrollCourse(walletAddress: string, courseId: string): Promise<boolean>;

  /** Closes an enrollment, removing progress and claiming back rent (Solana specific action) */
  closeEnrollment(walletAddress: string, courseId: string): Promise<boolean>;

  /** Claims the NFT credential for a completed course */
  claimCredential(walletAddress: string, courseId: string): Promise<{ success: boolean; signature?: string; error?: string }>;
  
  /** Gets leaderboard data */
  getLeaderboard(timeframe: 'weekly' | 'monthly' | 'all-time'): Promise<UserProgress[]>;
}
