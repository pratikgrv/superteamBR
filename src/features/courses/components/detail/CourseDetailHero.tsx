import { Badge } from "@/components/ui/badge";
import { Course } from "@/services/models/types";
import { Clock, BarChart, BookOpen, Star } from "lucide-react";

interface CourseDetailHeroProps {
  course: Course;
}

export function CourseDetailHero({ course }: CourseDetailHeroProps) {
  const hours = Math.floor(course.totalDurationMinutes / 60);
  const minutes = course.totalDurationMinutes % 60;
  const durationText = hours > 0 
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
    : `${minutes}m`;

  const reviews = course.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="bg-muted border-b relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/20 z-10" />
      <img 
        src={course.thumbnailUrl} 
        alt={course.title}
        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50 z-0"
      />

      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-primary/20 text-primary border-primary/20">
              {course.difficulty}
            </Badge>
            {course.category && (
              <Badge variant="outline" className="bg-background">
                {course.category}
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {averageRating}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {course.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
                {course.instructor.avatarUrl ? (
                  <img src={course.instructor.avatarUrl} alt={course.instructor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary uppercase">
                    {course.instructor.name.charAt(0)}
                  </div>
                )}
              </div>
              <span>By {course.instructor.name}</span>
            </div>

            <span className="text-muted-foreground">•</span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              {durationText}
            </span>

            <span className="text-muted-foreground">•</span>

            <span className="flex items-center gap-1.5">
              <BarChart className="w-4 h-4 text-muted-foreground" />
              {course.totalXp} XP
            </span>

            <span className="text-muted-foreground">•</span>

            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              {course.modules?.length || 0} Modules
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
