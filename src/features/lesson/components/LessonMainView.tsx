"use client";

import { useState } from "react";
import { Lesson } from "@/services/models/types";
import { LessonContentViewer } from "./LessonContentViewer";
import { LessonCodeEditor } from "./LessonCodeEditor";
import { BookOpen, Code2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LessonMainViewProps {
  lesson: Lesson;
}

export function LessonMainView({ lesson }: LessonMainViewProps) {
  // Determine if this lesson has code to show split view
  const hasCode = !!lesson.initialCode || lesson.title.toLowerCase().includes("program") || lesson.title.toLowerCase().includes("code");

  if (!hasCode) {
    // Theory only view
    return (
      <div className="w-full h-[calc(100vh-4rem-3.5rem)] lg:h-[calc(100vh-4rem)]">
        <LessonContentViewer lesson={lesson} />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-4rem-3.5rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Mobile Tabbed View */}
      <div className="flex-1 flex flex-col lg:hidden w-full h-full">
        <Tabs defaultValue="theory" className="w-full h-full flex flex-col">
          <TabsList className="w-full h-12 justify-start rounded-none border-b bg-muted/30 p-0 px-2 flex-shrink-0">
            <TabsTrigger 
              value="theory" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 font-medium flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Theory
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 font-medium flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="theory" className="flex-1 m-0 overflow-hidden outline-none">
            <LessonContentViewer lesson={lesson} />
          </TabsContent>
          <TabsContent value="code" className="flex-1 m-0 overflow-hidden outline-none bg-[#1e1e1e]">
            <LessonCodeEditor initialCode={lesson.initialCode} testCases={lesson.testCases} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Split View */}
      <div className="hidden lg:flex w-full h-full">
        {/* Left Side: Content */}
        <div className="w-1/2 h-full border-r flex flex-col">
          <div className="h-12 border-b bg-muted/30 flex items-center px-4 font-medium text-sm text-muted-foreground flex-shrink-0 gap-2">
            <BookOpen className="w-4 h-4" />
            Theory & Instructions
          </div>
          <div className="flex-1 overflow-hidden relative">
            <LessonContentViewer lesson={lesson} />
          </div>
        </div>

        {/* Right Side: Code Editor */}
        <div className="w-1/2 h-full flex flex-col bg-[#1e1e1e]">
          <div className="flex-1 overflow-hidden relative">
            <LessonCodeEditor initialCode={lesson.initialCode} testCases={lesson.testCases} />
          </div>
        </div>
      </div>
    </div>
  );
}
