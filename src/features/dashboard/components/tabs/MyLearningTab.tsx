"use client";

import { Course } from "@/services/models/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Clock, PlayCircle } from "lucide-react";

interface MyLearningTabProps {
  enrolledCourses: (Course & { progressPercentage: number; enrolledAt: string })[];
}

export function MyLearningTab({ enrolledCourses }: MyLearningTabProps) {
  if (enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
        <p className="font-medium text-foreground">You are not enrolled in any courses.</p>
        <p className="text-sm mt-1 mb-4">Discover paths and start learning today!</p>
        <Button asChild variant="outline">
          <Link href="/courses">Explore Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enrolledCourses.map((course) => (
        <Card key={course.id} className="bg-card hover:bg-muted/30 transition-colors border-border/50">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Thumbnail */}
            <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden relative border">
              <img 
                src={course.thumbnailUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur text-foreground">
                {course.difficulty}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <h3 className="font-bold text-lg truncate">{course.title}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(course.totalDurationMinutes / 60)}h {course.totalDurationMinutes % 60}m
                </span>
                <span>•</span>
                <span>{course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lessons</span>
              </div>
              
              <div className="mt-2 space-y-1.5 w-full max-w-md">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-primary">{course.progressPercentage}% Complete</span>
                </div>
                <Progress value={course.progressPercentage} className="h-1.5 bg-muted" />
              </div>
            </div>

            {/* Action */}
            <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
              <Button asChild className="w-full sm:w-auto" variant={course.progressPercentage === 100 ? "secondary" : "default"}>
                <Link href={`/courses/${course.slug}`}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {course.progressPercentage === 100 ? "Review Course" : "Continue"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
