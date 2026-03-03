"use client";
import { useState, useEffect } from 'react';
import { getUserProgressAction } from '@/app/actions/progress.actions';
import { UserProgress } from '@/services/models/types';

export function useUserProgress(walletAddress?: string | null) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setProgress(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    
    getUserProgressAction(walletAddress).then((data) => {
      if (isMounted) {
        setProgress(data);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [walletAddress]);

  return { progress, isLoading };
}
