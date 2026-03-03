import { Course } from "@/services/models/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, PlayCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CourseContentViewerProps {
  course: Course;
  completedLessonIds?: string[];
}

export function CourseContentViewer({ course, completedLessonIds = [] }: CourseContentViewerProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="mb-6 h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="modules" 
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-6 pb-3 pt-3 font-semibold"
          >
            Modules & Lessons
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-6 pb-3 pt-3 font-semibold"
          >
            Reviews ({(course.reviews || []).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-0 animate-in fade-in-50">
          <div className="space-y-6">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Course Content</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{course.modules?.length || 0} modules</span>
                <span>•</span>
                <span>
                  {(course.modules || []).reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0)} lessons
                </span>
                <span>•</span>
                <span>{Math.floor((course.totalDurationMinutes || 0) / 60)}h {(course.totalDurationMinutes || 0) % 60}m total length</span>
              </div>
            </div>

            {!(course.modules?.length > 0) ? (
              <p className="text-muted-foreground py-8 text-center text-sm border rounded-xl">No modules available for this course yet.</p>
            ) : (
              <Accordion type="multiple" className="w-full border rounded-xl overflow-hidden shadow-sm" defaultValue={["item-0"]}>
                {(course.modules || []).map((mod, moduleIndex) => {
                  const lessonCount = mod.lessons?.length || 0;
                  const moduleDuration = (mod.lessons || []).reduce((acc, les) => acc + (les.durationMinutes || 0), 0);
                  
                  return (
                    <AccordionItem value={`item-${moduleIndex}`} key={mod.id} className="border-b last:border-b-0 bg-card">
                      <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full pr-4 text-left gap-2">
                          <span className="font-semibold text-[15px]">{mod.title}</span>
                          <span className="text-xs font-normal text-muted-foreground lg:whitespace-nowrap hidden lg:inline-block">
                            {lessonCount} lessons • {moduleDuration} min
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0 border-t bg-background/50">
                        <div className="flex flex-col">
                          {(mod.lessons || []).map((lesson) => {
                            const isCompleted = completedLessonIds.includes(lesson.id);

                            return (
                              <Link 
                                key={lesson.id} 
                                href={`/courses/${course.slug}/lessons/${lesson.id}`}
                                className="flex items-start justify-between py-3 px-6 hover:bg-muted/30 transition-colors group border-b last:border-0"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5">
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/20" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className={`text-sm ${isCompleted ? 'text-muted-foreground' : 'font-medium'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                                  <span className="hidden sm:inline-block border px-2 py-0.5 rounded-full">
                                    {lesson.xpReward} XP
                                  </span>
                                  <span className="flex items-center gap-1 w-16 justify-end">
                                    <PlayCircle className="w-3.5 h-3.5" />
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
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4 mt-0 animate-in fade-in-50">
          {!(course.reviews?.length > 0) ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
              <Star className="w-8 h-8 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold">No reviews yet</h3>
              <p className="text-sm text-muted-foreground">Be the first to review this course after completing it!</p>
            </div>
          ) : (
            (course.reviews || []).map(review => (
              <Card key={review.id} className="bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs uppercase">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 mt-3">{review.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
