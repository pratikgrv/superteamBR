"use client";

import { UserProgress } from "@/services/models/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap } from "lucide-react";

interface ProfileStatsProps {
  progress: UserProgress;
  userName?: string;
}

export function ProfileStats({ progress, userName = "Learner" }: ProfileStatsProps) {
  // Mock calculate XP needed for next level: base 500 * level
  const xpForNextLevel = 500 * progress.level;
  const xpCurrentLevel = progress.totalXp % 500; // Simplified mock logic
  const progressPercent = (xpCurrentLevel / xpForNextLevel) * 100;

  return (
    <Card className="col-span-1 border-border/50 bg-background/50 backdrop-blur shadow-sm">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary uppercase">
            {userName.charAt(0)}
          </div>
          <div>
            <span>{userName}</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-normal text-muted-foreground">
              <span className="flex items-center gap-1 text-primary font-medium">
                <Star className="w-3.5 h-3.5 fill-primary" />
                Level {progress.level}
              </span>
              <span>•</span>
              <span>Rank: Novice Builder</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* XP Progress */}
        <div className="space-y-2.5">
          <div className="flex items-end justify-between text-sm">
            <span className="font-semibold text-foreground/90 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
              {progress.totalXp.toLocaleString()} XP Total
            </span>
            <span className="text-muted-foreground text-xs">
              {xpCurrentLevel} / {xpForNextLevel} to Level {progress.level + 1}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-muted/50" />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-white/5">
             <span className="text-xs text-muted-foreground flex items-center gap-1.5">
               <Trophy className="w-3.5 h-3.5 text-blue-400" />
               Completed
             </span>
             <span className="text-xl font-bold">{progress.completedLessonIds.length} <span className="text-sm font-normal text-muted-foreground">lessons</span></span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-white/5">
             <span className="text-xs text-muted-foreground flex items-center gap-1.5">
               <Zap className="w-3.5 h-3.5 text-orange-400" />
               Multiplier
             </span>
             <span className="text-xl font-bold">1.2x <span className="text-sm font-normal text-muted-foreground">bonus</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
