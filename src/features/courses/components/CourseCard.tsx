import { Course } from "@/services/models/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BarChart, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: Course;
  progressPercentage?: number; // If undefined, user is not enrolled
}

export function CourseCard({ course, progressPercentage }: CourseCardProps) {
  const isEnrolled = progressPercentage !== undefined;
  const isCompleted = isEnrolled && progressPercentage >= 100;

  // Format total hours
  const hours = Math.floor(course.totalDurationMinutes / 60);
  const minutes = course.totalDurationMinutes % 60;
  const durationText = hours > 0 
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
    : `${minutes}m`;

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="secondary" 
            className="bg-background/80 backdrop-blur-md shadow-sm font-semibold"
          >
            {course.difficulty}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-5 pb-0">
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-medium">
          {course.category && (
            <span className="flex items-center gap-1 text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              {course.category}
            </span>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {durationText}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <BarChart className="h-3.5 w-3.5" />
            {course.totalXp} XP
          </span>
        </div>
        <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
      </CardHeader>

      <CardContent className="p-5 pt-3 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        {isEnrolled && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className={isCompleted ? "text-primary" : "text-muted-foreground"}>
                {isCompleted ? "Completed" : "In Progress"}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 w-full" />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Button asChild className="w-full font-bold group/btn" variant={isEnrolled && !isCompleted ? "default" : "outline"}>
          <Link href={`/courses/${course.slug}`}>
            {isCompleted ? "Review Course" : isEnrolled ? "Continue Learning" : "Start Course"}
            <ChevronRight className="ml-1.5 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
