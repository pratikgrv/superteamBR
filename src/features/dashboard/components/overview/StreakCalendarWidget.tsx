"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, CalendarDays } from "lucide-react";
import { UserProgress } from "@/services/models/types";

interface StreakCalendarWidgetProps {
  progress: UserProgress;
}

export function StreakCalendarWidget({ progress }: StreakCalendarWidgetProps) {
  // Generate a mock Github-style contribution graph (last 14 days)
  const currentDays = progress.streakDays;
  const days = Array.from({ length: 14 }).map((_, i) => {
    const isMockActive = i < currentDays || Math.random() > 0.6; // Ensure current streak days plus some random past activity
    return {
      id: i,
      active: i === 0 || isMockActive, 
    };
  }).reverse(); // Latest day (today) is at the end

  return (
    <Card className="col-span-1 border-border/50 bg-background/50 backdrop-blur shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
            Current Streak
          </span>
          <span className="text-2xl font-black text-orange-500">
            {currentDays} <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Days</span>
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Simplified Calendar View */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
            <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> past 14 days</span>
            <span>Today</span>
          </div>
          <div className="flex gap-1.5 w-full justify-between">
            {days.map((day, idx) => (
              <div 
                key={day.id} 
                className={`flex-1 aspect-square rounded-[3px] sm:rounded-md transition-all duration-300 ${
                  day.active 
                    ? idx === days.length - 1 
                      ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' // Today (active)
                      : 'bg-orange-500/60 hover:bg-orange-500/80' // Past active
                    : 'bg-muted/50' // Inactive
                }`}
                title={day.active ? "Learning Activity Recorded" : "No Activity"}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 mt-2">
          <p className="text-sm font-medium text-orange-500/90 flex items-center gap-2">
            You're on fire! 🔥
          </p>
          <p className="text-xs text-muted-foreground">
            Complete a lesson today to maintain your {currentDays}x multiplier bonus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
