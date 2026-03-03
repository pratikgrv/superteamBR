"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCourseDetail } from "@/features/courses/hooks/useCourseDetail";
import { useEnrollmentState } from "@/features/courses/hooks/useEnrollmentState";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { CourseDetailHero } from "@/features/courses/components/detail/CourseDetailHero";
import { CourseContentViewer } from "@/features/courses/components/detail/CourseContentViewer";
import { CourseActionPanel } from "@/features/courses/components/detail/CourseActionPanel";

export default function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const { course, isLoading: courseLoading, error } = useCourseDetail(slug);
  const { 
    enrollment, 
    state: enrollmentState, 
    isLoading: stateLoading,
    isProcessing,
    canCloseEnrollment,
    actions
  } = useEnrollmentState(walletAddress, course?.id);

  if (courseLoading) return <div className="p-8 max-w-7xl mx-auto"><PageSkeleton /></div>;
  if (error) return <ErrorState title="Failed to load course details" message={error} />;
  if (!course) return notFound();

  return (
    <div className="min-h-screen pb-24">
      <CourseDetailHero course={course} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area (Tabs: Modules & Reviews) */}
          <div className="flex-1 lg:max-w-[calc(100%-25rem)]">
            <CourseContentViewer 
              course={course} 
              // TODO: connect with actual completed lesson map from progressService
              completedLessonIds={[]} 
            />
          </div>

          {/* Sidebar / Action Panel */}
          <div className="w-full lg:w-96 flex-shrink-0">
            {stateLoading ? (
              <div className="h-64 rounded-xl bg-card border shadow-sm animate-pulse" />
            ) : (
              <CourseActionPanel 
                state={enrollmentState}
                progressPercentage={enrollment?.progressPercentage || 0}
                canClose={canCloseEnrollment}
                isProcessing={isProcessing}
                onEnroll={actions.enroll}
                onClose={actions.closeEnrollment}
                onClaim={actions.claimCredential}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
