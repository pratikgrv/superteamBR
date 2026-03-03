"use client";

import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { ProfileStats } from "@/features/dashboard/components/overview/ProfileStats";
import { StreakCalendarWidget } from "@/features/dashboard/components/overview/StreakCalendarWidget";
import { AchievementsWidget } from "@/features/dashboard/components/overview/AchievementsWidget";
import { RecommendedCourses } from "@/features/dashboard/components/overview/RecommendedCourses";
import { MyLearningTab } from "@/features/dashboard/components/tabs/MyLearningTab";
import { RecentActivityTab } from "@/features/dashboard/components/tabs/RecentActivityTab";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Activity } from "lucide-react";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@/components/ui/button";

export function DashboardContent() {
  const { data: session, isPending } = authClient.useSession();
  const { 
    progress, 
    enrolledCourses, 
    recommendedCourses, 
    recentActivity, 
    isLoading: isDashboardLoading, 
    error 
  } = useDashboardData();

  if (isPending || isDashboardLoading) return <div className="p-8 max-w-7xl mx-auto w-full"><PageSkeleton /></div>;
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet & Sign In</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Please sign in to view your personalized learning dashboard, track progress, and claim API credentials.
        </p>
      </div>
    );
  }

  if (error || !progress) return <ErrorState title="Dashboard Error" message={error || "Could not load profile data"} />;

  // Display user's registered name or fallback to part of their ID
  const displayName = session.user.name || "Learner";

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 animate-in fade-in-50 duration-500">
      
      {/* 1. Top Overview Section */}
      <section className="space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProfileStats progress={progress} userName={displayName} />
          <StreakCalendarWidget progress={progress} />
          <AchievementsWidget recentActivity={recentActivity} />
        </div>
      </section>

      {/* 2. Main Content Grid (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Tabs (My Learning / Recent Activity) */}
        <section className="lg:col-span-2">
          <Tabs defaultValue="learning" className="w-full">
            <TabsList className="mb-6 h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger 
                value="learning" 
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-6 pb-3 pt-3 font-semibold flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                My Learning
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-6 pb-3 pt-3 font-semibold flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Recent Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learning" className="mt-0 animate-in fade-in-50">
              <MyLearningTab enrolledCourses={enrolledCourses} />
            </TabsContent>

            <TabsContent value="activity" className="mt-0 animate-in fade-in-50">
              <RecentActivityTab recentActivity={recentActivity} />
            </TabsContent>
          </Tabs>
        </section>

        {/* Right Column: Recommendations */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Suggested Paths</h2>
          {recommendedCourses.length > 0 ? (
            <RecommendedCourses courses={recommendedCourses} />
          ) : (
            <div className="text-sm text-muted-foreground p-6 border border-dashed rounded-xl bg-muted/20 text-center">
              No new recommendations right now.
            </div>
          )}
        </section>

      </div>

    </div>
  );
}
