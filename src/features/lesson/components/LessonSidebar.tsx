"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { Course } from "@/services/models/types";
import { CourseCurriculum } from "./CourseCurriculum";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LessonSidebarProps {
  course: Course;
  rawLessonFlags?: string | null;
}

export function LessonSidebar({ course, rawLessonFlags }: LessonSidebarProps) {
  const activeLessonId = useSelectedLayoutSegment();

  return (
    <aside className="fixed top-16 bottom-0 left-0 w-80 border-r bg-background hidden lg:flex flex-col z-30">
      <ScrollArea className="flex-1 w-full">
        <CourseCurriculum 
          course={course} 
          rawLessonFlags={rawLessonFlags} 
          activeLessonId={activeLessonId || undefined} 
        />
      </ScrollArea>
    </aside>
  );
}
