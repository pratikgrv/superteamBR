import { Lesson } from "@/services/models/types";
import { Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LessonContentViewerProps {
  lesson: Lesson;
}

export function LessonContentViewer({ lesson }: LessonContentViewerProps) {
  // We use placeholder content if none exists to demonstrate the UI
  const contentHtml = lesson.content || `
    <h2>Introduction</h2>
    <p>Welcome to this interactive lesson on Solana development. In this module, you will learn the foundational concepts necessary for building fast, secure, and scalable decentralized applications.</p>
    
    <h3>Key Concepts</h3>
    <ul>
      <li><strong>Accounts:</strong> Everything in Solana is an account.</li>
      <li><strong>Programs:</strong> Smart contracts are stateless programs.</li>
      <li><strong>Transactions:</strong> Instructions are bundled into atomic transactions.</li>
    </ul>

    <h3>Instructions</h3>
    <p>Read through the theory here, and when you are ready, move over to the code editor to complete the implementation challenge.</p>
  `;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 md:p-12 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Theory
            </Badge>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
              <Clock className="w-4 h-4" />
              {lesson.durationMinutes} min read
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
              <Award className="w-4 h-4 ml-2" />
              {lesson.xpReward} XP
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            {lesson.title}
          </h1>

          {lesson.description && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Video Embed (Optional) */}
        {lesson.videoUrl && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden border bg-muted shadow-lg">
            {/* Replace with actual video player */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Video Player Placeholder ({lesson.videoUrl})
            </div>
          </div>
        )}

        {/* Markdown / HTML Content */}
        <div 
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-li:marker:text-primary"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}
