"use client";

import {
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	PlayCircle,
} from "lucide-react";
import { useState } from "react";
import type { UserCourseProgress } from "@/lib/data/courses";

interface ModuleListProps {
	course: any;
	userProgress?: UserCourseProgress;
}

export function ModuleList({ course, userProgress }: ModuleListProps) {
	// Start with the first module expanded by default
	const [expandedModules, setExpandedModules] = useState<
		Record<string, boolean>
	>({
		[course.modules && course.modules[0] ? course.modules[0]._id : ""]: true,
	});

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => ({
			...prev,
			[moduleId]: !prev[moduleId],
		}));
	};

	const isLessonCompleted = (lessonId: string) => {
		return userProgress?.completedLessonIds.includes(lessonId) ?? false;
	};

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold tracking-tight mb-6">Course Content</h2>

			<div className="flex flex-col gap-3">
				{course.modules?.map((module: any, index: number) => {
					const isExpanded = expandedModules[module._id];
					const totalLessons = module.lessons?.length || 0;
					const completedLessons =
						module.lessons?.filter((l: any) => isLessonCompleted(l._id))
							.length || 0;

					return (
						<div
							key={module._id}
							className="border border-border rounded-xl bg-card overflow-hidden transition-all shadow-sm"
						>
							<button
								type="button"
								onClick={() => toggleModule(module._id)}
								className="w-full flex items-center justify-between p-5 text-left bg-muted/20 hover:bg-muted/40 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
										{index + 1}
									</div>
									<div>
										<h3 className="font-semibold text-foreground">
											{module.title}
										</h3>
										<div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
											<span>
												{completedLessons} / {totalLessons} Lessons
											</span>
											<span>•</span>
											<span>
												{module.lessons?.reduce(
													(acc: number, l: any) =>
														acc + (l.durationMinutes || 0),
													0,
												) || 0}{" "}
												mins
											</span>
										</div>
									</div>
								</div>
								{isExpanded ?
									<ChevronDown className="h-5 w-5 text-muted-foreground" />
								:	<ChevronRight className="h-5 w-5 text-muted-foreground" />}
							</button>

							{isExpanded && module.lessons && (
								<div className="divide-y divide-border border-t border-border bg-background">
									{module.lessons.map((lesson: any, lessonIndex: number) => {
										const completed = isLessonCompleted(lesson._id);

										return (
											<div
												key={lesson._id}
												className={`flex items-start gap-4 p-4 hover:bg-muted/10 transition-colors ${
													completed ? "opacity-80" : ""
												}`}
											>
												<div className="mt-0.5">
													{completed ?
														<CheckCircle2 className="w-5 h-5 text-green-500" />
													:	<PlayCircle className="w-5 h-5 text-muted-foreground/50" />
													}
												</div>

												<div className="flex-1">
													<div className="flex items-start justify-between">
														<h4
															className={`text-sm font-medium ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}
														>
															{lessonIndex + 1}. {lesson.title}
														</h4>
														<span className="text-xs text-muted-foreground tabular-nums">
															{lesson.durationMinutes}m
														</span>
													</div>

													{lesson.description && (
														<p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
															{lesson.description}
														</p>
													)}

													<div className="mt-2 flex items-center gap-2">
														<span className="inline-flex items-center rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
															+{course.xpPerLesson || 0} XP
														</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
