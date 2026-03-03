'use server'

import { progressService } from '@/services';
import { UserProgress } from '@/services/models/types';

export async function getUserProgressAction(walletAddress: string): Promise<UserProgress | null> {
  try {
    return await progressService.getProgress(walletAddress);
  } catch (e) {
    console.error("Error in getUserProgressAction:", e);
    return null;
  }
}
