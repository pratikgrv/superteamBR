"use client";

import { Link } from "@/i18n/routing";
import { CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Course } from "@/services/models/types";

interface CourseCurriculumProps {
  course: Course;
  rawLessonFlags?: string | null; // e.g., "✓ ✓ · · ·"
  activeLessonId?: string;
  onLessonSelect?: () => void; // Optional callback for mobile closing
}

export function CourseCurriculum({ course, rawLessonFlags, activeLessonId, onLessonSelect }: CourseCurriculumProps) {
  // Parse the flags into an array of booleans if string is provided
  // Example: "✓ ✓ · ·" -> [true, true, false, false]
  const parsedFlags = rawLessonFlags 
    ? rawLessonFlags.split(" ").map(char => char === "✓")
    : [];

  let globalLessonIndex = 0;

  // Find the module index that contains the active lesson to keep it open by default
  let defaultAccordionValue = "item-0";
  if (activeLessonId && course.modules) {
    const activeModuleIndex = course.modules.findIndex(m => m.lessons.some(l => l.id === activeLessonId));
    if (activeModuleIndex >= 0) {
      defaultAccordionValue = `item-${activeModuleIndex}`;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-6 pt-6">
        <h2 className="text-xl font-bold tracking-tight">Course Content</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{course.modules?.length || 0} modules</span>
          <span>•</span>
          <span>
            {course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0} lessons
          </span>
          <span>•</span>
          <span>{Math.floor((course.totalDurationMinutes || 0) / 60)}h {(course.totalDurationMinutes || 0) % 60}m total length</span>
        </div>
      </div>

      <Accordion type="multiple" className="w-full border-t" defaultValue={[defaultAccordionValue]}>
        {course.modules?.map((mod, moduleIndex) => {
          const lessonCount = mod.lessons?.length || 0;
          const moduleDuration = mod.lessons?.reduce((acc, les) => acc + (les.durationMinutes || 0), 0) || 0;
          
          return (
            <AccordionItem value={`item-${moduleIndex}`} key={mod.id} className="border-b last:border-b-0 bg-transparent">
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline transition-colors text-left focus:ring-0">
                <div className="flex flex-col w-full pr-4 gap-1">
                  <span className="font-semibold text-sm">{mod.title}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {lessonCount} lessons • {moduleDuration} min
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 border-t bg-muted/20">
                <div className="flex flex-col">
                  {mod.lessons?.map((lesson) => {
                    const currentIndex = globalLessonIndex++;
                    const isCompleted = parsedFlags[currentIndex] === true;
                    const isActive = lesson.id === activeLessonId;

                    return (
                      <Link 
                        key={lesson.id} 
                        href={`/courses/${course.slug}/lessons/${lesson.id}`}
                        onClick={onLessonSelect}
                        className={`flex items-start justify-between py-3 px-6 transition-colors group border-b last:border-0 relative ${
                          isActive ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                        )}
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-green-500 fill-green-500/20'}`} />
                            ) : (
                              <Circle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground/70'} transition-colors`} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm ${isActive ? 'font-semibold text-primary' : isCompleted ? 'text-muted-foreground' : 'font-medium'}`}>
                              {lesson.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                          <span className="flex items-center justify-end">
                            {lesson.durationMinutes}m
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
