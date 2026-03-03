import { useState, useEffect } from "react";
import { progressService } from "@/services";
import { CourseEnrollment } from "@/services/models/types";

export type EnrollmentState = 
  | "NOT_ENROLLED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CLAIMED_CREDENTIAL";

export function useEnrollmentState(walletAddress: string | undefined, courseId: string | undefined) {
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchState = async () => {
    if (!walletAddress || !courseId) {
      setEnrollment(null);
      setIsLoading(false);
      return;
    }

    try {
      const progress = await progressService.getProgress(walletAddress);
      const courseEnrollment = progress.enrollments.find(e => e.courseId === courseId);
      setEnrollment(courseEnrollment || null);
    } catch (err) {
      console.error("Failed to fetch enrollment state", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [walletAddress, courseId]);

  // Derived states
  let state: EnrollmentState = "NOT_ENROLLED";
  if (enrollment) {
    if (enrollment.credentialClaimed) {
      state = "CLAIMED_CREDENTIAL";
    } else if (enrollment.progressPercentage >= 100) {
      state = "COMPLETED";
    } else {
      state = "IN_PROGRESS";
    }
  }

  // Can close if > 24 hours have passed since enrollment
  const canCloseEnrollment = enrollment 
    ? (Date.now() - new Date(enrollment.enrolledAt).getTime()) > 24 * 60 * 60 * 1000
    : false;

  // Actions
  const enroll = async () => {
    if (!walletAddress || !courseId) return false;
    setIsProcessing(true);
    try {
      const success = await progressService.enrollCourse(walletAddress, courseId);
      if (success) await fetchState();
      return success;
    } finally {
      setIsProcessing(false);
    }
  };

  const closeEnrollment = async () => {
    if (!walletAddress || !courseId || !canCloseEnrollment) return false;
    setIsProcessing(true);
    try {
      const success = await progressService.closeEnrollment(walletAddress, courseId);
      if (success) await fetchState();
      return success;
    } finally {
      setIsProcessing(false);
    }
  };

  const claimCredential = async () => {
    if (!walletAddress || !courseId || state !== "COMPLETED") return false;
    setIsProcessing(true);
    try {
      const res = await progressService.claimCredential(walletAddress, courseId);
      if (res.success) await fetchState();
      return res.success;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    enrollment,
    state,
    isLoading,
    isProcessing,
    canCloseEnrollment,
    actions: { enroll, closeEnrollment, claimCredential, fetchState }
  };
}
