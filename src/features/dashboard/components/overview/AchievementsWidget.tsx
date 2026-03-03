"use client";

import { ActivityItem } from "../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck, Star } from "lucide-react";

interface AchievementsWidgetProps {
  recentActivity: ActivityItem[];
}

export function AchievementsWidget({ recentActivity }: AchievementsWidgetProps) {
  // Extract only achievement-related activities to show as recent badges
  const badges = recentActivity.filter(a => a.type === "ACHIEVEMENT_UNLOCKED" || a.type === "CREDENTIAL_CLAIMED");

  return (
    <Card className="col-span-1 lg:col-span-2 border-border/50 bg-background/50 backdrop-blur shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
            Recent Badges
          </span>
          <span className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            View All
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {badges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
            <ShieldCheck className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm font-medium">No badges earned yet.</p>
            <p className="text-xs">Complete courses to earn certificates and XP badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.slice(0, 4).map((badge, idx) => (
              <div 
                key={badge.id} 
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-card to-card/50 border border-white/5 hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all cursor-pointer group"
                title={badge.description}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {badge.type === "CREDENTIAL_CLAIMED" ? (
                    <ShieldCheck className="w-6 h-6 text-indigo-500" />
                  ) : (
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                  )}
                </div>
                <span className="text-xs font-semibold text-center leading-tight line-clamp-2">
                  {badge.title.replace("Unlocked Badge: ", "").replace("Claimed NFT Certificate for Course ", "")}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  +{badge.xpEarned} XP
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
