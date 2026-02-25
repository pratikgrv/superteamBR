import { BookOpen, Clock, PlayCircle, Star, Trophy, User } from "lucide-react";
import Image from "next/image";

interface CourseHeaderProps {
  course: any;
  enrolled: boolean;
}

export function CourseHeader({ course, enrolled }: CourseHeaderProps) {
  const averageRating =
    course.reviews?.length > 0
      ? (
          course.reviews.reduce((acc: any, rev: any) => acc + rev.rating, 0) /
          course.reviews.length
        ).toFixed(1)
      : "New";

  const difficultyLabel =
    course.difficulty === 1
      ? "Beginner"
      : course.difficulty === 2
        ? "Intermediate"
        : course.difficulty === 3
          ? "Advanced"
          : "Beginner";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm mb-8">
      <div className="flex flex-col md:flex-row">
        {/* Left Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex gap-2 items-center mb-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {difficultyLabel}
            </span>
            {course.topics?.map((topic: string) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full bg-secondary/80 px-3 py-1 text-sm font-medium text-secondary-foreground"
              >
                {topic}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {course.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                {course.instructor?.name || "TBA"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>
                {course.totalDurationMinutes
                  ? Math.round(course.totalDurationMinutes / 60)
                  : 0}
                h{" "}
                {course.totalDurationMinutes
                  ? course.totalDurationMinutes % 60
                  : 0}
                m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{course.modules?.length || 0} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>{course.totalXp || 0} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span>
                {averageRating} ({course.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-auto">
            {enrolled ? (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Resume Learning
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-md"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative hidden md:block w-[400px] lg:w-[500px] shrink-0">
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent" />
        </div>
      </div>
    </div>
  );
}
