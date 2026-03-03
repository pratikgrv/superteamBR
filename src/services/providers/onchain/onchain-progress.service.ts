import { ILearningProgressService } from '../../interfaces/learning-progress.service';
import { UserProgress } from '../../models/types';
import { Connection, PublicKey } from '@solana/web3.js';

export class OnChainProgressService implements ILearningProgressService {
  private connection: Connection;
  private programId: PublicKey;

  constructor() {
    // We connect to devnet as specified by the superteam-academy rules
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    // Replace this with the actual un-stubbed Program ID later
    this.programId = new PublicKey("22222222222222222222222222222222222222222222"); 
  }

  async getProgress(walletAddress: string): Promise<UserProgress> {
    try {
      const userPubKey = new PublicKey(walletAddress);
      
      let totalXp = 0;
      
      console.log(`[OnChain] Fetching Token-2022 XP balances from Devnet for ${userPubKey}...`);
      
      // STUB: Real implementation will use getAssociatedTokenAddressSync and getAccount from @solana/spl-token
      // to read the Token-2022 balance for the user's XP token.
      totalXp = 1800; 

      // Level = floor(sqrt(xp / 100)) as per the prompt specifications
      const level = Math.floor(Math.sqrt(totalXp / 100)) || 1;

      // Streaks are a FRONTEND-ONLY feature implemented via local storage
      const localStreak = this.getFrontendStreak(walletAddress);

      return {
        walletAddress,
        totalXp,
        level,
        completedLessonIds: ['lesson-1', 'lesson-2'], // This will be read from the Course PDA enrollment Bitmap
        streakDays: localStreak,
        enrollments: [] // Stub
      };
    } catch (error) {
      console.error("Failed to fetch on-chain progress:", error);
      // Fallback
      return {
        walletAddress,
        totalXp: 0,
        level: 1,
        completedLessonIds: [],
        streakDays: this.getFrontendStreak(walletAddress),
        enrollments: []
      };
    }
  }

  async completeLesson(walletAddress: string, courseSlug: string, lessonId: string) {
    console.log(`[OnChain] Preparing backend-signed TX for course ${courseSlug}, lesson ${lessonId}`);
    return { success: true, newXpLevel: 1900 };
  }

  async enrollCourse(walletAddress: string, courseId: string) {
    console.log(`[OnChain] Generating user-signed enrollment TX for ${courseId}`);
    return true;
  }

  async closeEnrollment(walletAddress: string, courseId: string) {
    console.log(`[OnChain] Generating user-signed close enrollment TX for ${courseId}`);
    return true;
  }

  async claimCredential(walletAddress: string, courseId: string) {
    console.log(`[OnChain] Preparing backend-signed claim TX for ${courseId}`);
    return { success: true, signature: "mock-tx-signature-123" };
  }

  async getLeaderboard(timeframe: 'weekly' | 'monthly' | 'all-time'): Promise<UserProgress[]> {
    console.log(`[OnChain] Fetching leaderboard from Helius DAS API / Custom Indexer for ${timeframe}`);
    // Leaderboard is off-chain — derived by indexing XP token balances
    return [
       {
        walletAddress: "8xM...4vP",
        totalXp: 9500,
        level: Math.floor(Math.sqrt(9500 / 100)),
        completedLessonIds: [],
        streakDays: 45,
        enrollments: []
      }
    ];
  }

  /**
   * Helper function for Frontend-only streak logic as required by the spec
   */
  private getFrontendStreak(wallet: string): number {
    if (typeof window === "undefined") return 0;
    const data = window.localStorage.getItem(`streak_${wallet}`);
    return data ? parseInt(data, 10) : 14; // default to 14 for visual demo testing
  }
}
