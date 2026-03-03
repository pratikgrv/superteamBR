"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCourseDetail } from "@/features/courses/hooks/useCourseDetail";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { LessonMainView } from "@/features/lesson/components/LessonMainView";
import { LessonNavigation } from "@/features/lesson/components/LessonNavigation";

export default function LessonDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string; lessonId: string }> 
}) {
  const unwrappedParams = use(params);
  const { slug, lessonId } = unwrappedParams;
  
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const { course, isLoading, error } = useCourseDetail(slug);

  if (isLoading) return <div className="p-8"><PageSkeleton /></div>;
  if (error) return <ErrorState title="Failed to load lesson" message={error} />;
  if (!course) return notFound();

  // Find current lesson and surrounding layout context
  let currentLesson = null;
  let prevLessonId = undefined;
  let nextLessonId = undefined;
  
  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  
  if (currentIndex >= 0) {
    currentLesson = allLessons[currentIndex];
    prevLessonId = currentIndex > 0 ? allLessons[currentIndex - 1].id : undefined;
    nextLessonId = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : undefined;
  }

  if (!currentLesson) return notFound();

  // --- DEMO SHOWCASE ---
  const demoCode = `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, Solana World!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
`;

  const demoContent = `
    <h2>Introduction to Anchor Programs</h2>
    <p>Welcome to this interactive lesson on Solana development using the Anchor framework.</p>
    
    <h3>What is Anchor?</h3>
    <p>Anchor is a framework for Solana's Sealevel runtime providing several convenient developer tools for writing smart contracts. It effectively abstracts away a lot of boilerplate code.</p>

    <h3>Your Task</h3>
    <p>In the code editor on the right, we have provided a basic Hello World program. Review the code, and when you are ready, click <strong>"Run & Verify"</strong> to see the simulated output of this program.</p>
  `;

  // Apply demo overrides to showcase the editor if it doesn't already have code
  const lessonWithDemo = {
    ...currentLesson,
    initialCode: currentLesson.initialCode || demoCode,
    content: currentLesson.content || demoContent,
    title: currentLesson.initialCode ? currentLesson.title : `[Demo] ${currentLesson.title}`,
    testCases: currentLesson.testCases || [
      {
        id: "test_1",
        description: "Program should include the 'msg!' macro to log a greeting",
        requiredPattern: "msg!\\(.*\\)",
      },
      {
        id: "test_2",
        description: "Program logic should be inside an 'initialize' function",
        requiredPattern: "pub fn initialize\\(ctx: Context<Initialize>\\)",
      }
    ]
  };
  
  const hasCode = !!lessonWithDemo.initialCode || lessonWithDemo.title.toLowerCase().includes("program") || lessonWithDemo.title.toLowerCase().includes("code");
  // ---------------------

  // STUB: Replace with actual `useLessonProgress` hook logic
  const isCompleted = false;
  const handleComplete = async () => {
    console.log(`STUB: Complete lesson ${lessonWithDemo.id}`);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* 
        The LessonLayout handles the Sidebar / Mobile Header.
        This page only renders the main content area (LessonMainView) 
        and the sticky footer navigation (LessonNavigation). 
      */}
      <div className="flex-1 w-full relative">
        <LessonMainView lesson={lessonWithDemo} />
      </div>
      
      <LessonNavigation 
        prevLessonId={prevLessonId}
        nextLessonId={nextLessonId}
        courseSlug={slug}
        isCompleted={isCompleted}
        onComplete={handleComplete}
        hideMarkComplete={hasCode}
      />
    </div>
  );
}
