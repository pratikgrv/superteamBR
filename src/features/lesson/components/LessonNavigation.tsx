"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface LessonNavigationProps {
  prevLessonId?: string;
  nextLessonId?: string;
  courseSlug: string;
  isCompleted?: boolean;
  onComplete?: () => void;
  hideMarkComplete?: boolean;
}

export function LessonNavigation({ 
  prevLessonId, 
  nextLessonId, 
  courseSlug,
  isCompleted,
  onComplete,
  hideMarkComplete
}: LessonNavigationProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleComplete = async () => {
    if (!onComplete || isCompleted) return;
    setIsProcessing(true);
    await onComplete();
    setIsProcessing(false);
  };

  return (
    <div className="h-20 border-t bg-background flex flex-col sm:flex-row items-center justify-between px-6 shrink-0 gap-4 sm:gap-0 sticky bottom-0 z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex-1">
        {prevLessonId && (
          <Button variant="outline" asChild className="hidden sm:flex group">
            <a href={`/courses/${courseSlug}/lessons/${prevLessonId}`}>
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous Lesson
            </a>
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-center w-full sm:w-auto">
        {!hideMarkComplete && (
          isCompleted ? (
            <Button variant="secondary" className="w-full sm:w-auto bg-green-500/10 text-green-600 hover:bg-green-500/20 pointer-events-none">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Completed
            </Button>
          ) : (
            <Button 
              className="w-full sm:w-auto font-bold shadow-md bg-primary/90 hover:bg-primary"
              onClick={handleComplete}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Mark as Complete"}
            </Button>
          )
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {nextLessonId ? (
          <Button variant="default" asChild className="hidden sm:flex group bg-muted text-foreground hover:bg-muted/80">
            <a href={`/courses/${courseSlug}/lessons/${nextLessonId}`}>
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        ) : (
          <Button variant="default" asChild className="hidden sm:flex group">
            <a href={`/courses/${courseSlug}`}>
              Finish Course
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
