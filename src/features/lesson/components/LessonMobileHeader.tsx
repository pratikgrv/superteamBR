"use client";

import { useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { Course } from "@/services/models/types";
import { CourseCurriculum } from "./CourseCurriculum";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonMobileHeaderProps {
  course: Course;
  rawLessonFlags?: string | null;
}

export function LessonMobileHeader({ course, rawLessonFlags }: LessonMobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLessonId = useSelectedLayoutSegment();
  
  // Find active lesson name
  let activeLessonName = "Course Content";
  if (activeLessonId && course.modules) {
    for (const mod of course.modules) {
      const lesson = mod.lessons?.find(l => l.id === activeLessonId);
      if (lesson) {
        activeLessonName = lesson.title;
        break;
      }
    }
  }

  // Calculate generic course progress
  const parsedFlags = rawLessonFlags 
    ? rawLessonFlags.split(" ").map(char => char === "✓")
    : [];
  const completedLessonsCount = parsedFlags.filter(Boolean).length;
  const totalLessonsCount = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
  const progressPercent = totalLessonsCount === 0 ? 0 : Math.round((completedLessonsCount / totalLessonsCount) * 100);

  return (
    <div className="lg:hidden sticky top-16 z-40 w-full bg-background border-b shadow-sm">
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col gap-0.5 max-w-[80%]">
          <span className="text-xs text-muted-foreground font-medium">{course.title}</span>
          <span className="text-sm font-bold truncate flex items-center gap-1.5">
            {activeLessonName}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </div>
        
        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center w-9 h-9 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted/30"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="text-primary transition-all duration-700 ease-in-out"
              strokeDasharray={`${progressPercent}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-foreground">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Expandable Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 max-h-[calc(100vh-8rem)] overflow-y-auto bg-background border-b shadow-xl">
          <CourseCurriculum 
            course={course} 
            rawLessonFlags={rawLessonFlags} 
            activeLessonId={activeLessonId || undefined}
            onLessonSelect={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
