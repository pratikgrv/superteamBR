"use client";

import { ActivityItem } from "../../hooks/useDashboardData";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, ShieldCheck, Trophy, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";

interface RecentActivityTabProps {
  recentActivity: ActivityItem[];
}

export function RecentActivityTab({ recentActivity }: RecentActivityTabProps) {
  if (recentActivity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
        <p className="font-medium">No recent activity.</p>
        <p className="text-sm mt-1">Start learning to see your progress history here!</p>
      </div>
    );
  }

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "COURSE_COMPLETED":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "LESSON_COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "CREDENTIAL_CLAIMED":
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      case "ACHIEVEMENT_UNLOCKED":
        return <Sparkles className="w-4 h-4 text-orange-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="relative space-y-0 pl-6 ml-2">
      {/* Vertical timeline line */}
      <div className="absolute top-0 bottom-0 left-[15px] w-px bg-border" />

      {recentActivity.map((activity, index) => (
        <div key={activity.id} className="relative pb-8 last:pb-0">
          {/* Timeline node */}
          <div className="absolute left-[-26px] top-1 w-6 h-6 rounded-full bg-background border flex items-center justify-center z-10">
            {getIcon(activity.type)}
          </div>

          <div className="flex flex-col gap-1 pr-4">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <span className="font-semibold text-sm">
                {activity.link ? (
                  <Link href={activity.link as any} className="hover:text-primary transition-colors hover:underline">
                    {activity.title}
                  </Link>
                ) : (
                  activity.title
                )}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>

            {activity.xpEarned && (
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                  +{activity.xpEarned} XP
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
