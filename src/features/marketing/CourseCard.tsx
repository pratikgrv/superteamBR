"use client";

import { BookOpen, Clock, Trophy } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Course } from '@/services/models/types';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();
  const { progress: userProgress } = useUserProgress(walletAddress);

  // We check if this specific course ID exists in the user's completed/enrolled lessons or XP mapping.
  // In a real database/on-chain world, this would likely be an explicit isEnrolled boolean check
  // For the stub UI right now, we can check if they have a non-null progress or default it based on mock data.
  // Given the stub only has one course, we just stub the progress out visually for the demo.
  const isEnrolled = !!userProgress;
  const displayProgress = userProgress ? 15 : null; // Arbitrary 15% progress demo

  return (
    <div className="group flex flex-col rounded-xl bg-card border overflow-hidden hover:border-primary/50 transition-all duration-300 h-full shadow-sm hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-primary border shadow-sm">
            {course.difficulty}
          </span>
          {course.category && (
            <span className="px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-foreground border shadow-sm">
              {course.category}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {Math.round(course.totalDurationMinutes / 60)}h {course.totalDurationMinutes % 60}m
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-yellow-500" />
            {course.totalXp} XP
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {course.modules.length} Modules
          </div>
        </div>

        {/* Progress or CTA */}
        {isEnrolled ? (
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary">{displayProgress}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              Continue Learning
            </Link>
          </div>
        ) : (
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center justify-center w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm"
          >
            Start Course
          </Link>
        )}
      </div>
    </div>
  );
}
