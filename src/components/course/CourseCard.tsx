import { BookOpen, Clock, Star, User } from "lucide-react";
import Image from "next/image";
import { Link } from "@/lib/i18n/routing";

interface CourseCardProps {
	course: any; // Using any for now until we fully type the Sanity payload
	progressPercentage?: number;
}

export function CourseCard({ course, progressPercentage }: CourseCardProps) {
	const difficultyLabel =
		course.difficulty === 1 ? "Beginner"
		: course.difficulty === 2 ? "Intermediate"
		: course.difficulty === 3 ? "Advanced"
		: "Beginner";

	return (
		<Link href={`/courses/${course.slug}`}>
			<div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow hover:shadow-lg transition-all transform hover:-translate-y-1 h-full">
				{/* Thumbnail */}
				<div className="relative h-48 w-full overflow-hidden bg-muted">
					<Image
						src={course.thumbnailUrl}
						alt={course.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					<div className="absolute top-3 left-3 flex gap-2">
						<span className="inline-flex items-center rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground backdrop-blur-sm shadow-sm">
							{difficultyLabel}
						</span>
						{course.topics[0] && (
							<span className="inline-flex items-center rounded-full bg-secondary/90 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground backdrop-blur-sm shadow-sm">
								{course.topics[0]}
							</span>
						)}
					</div>
				</div>

				{/* Content */}
				<div className="flex flex-1 flex-col p-5">
					<h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
						{course.title}
					</h3>
					<p className="mt-2 text-sm text-muted-foreground line-clamp-2">
						{course.description}
					</p>

					<div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<Clock className="h-4 w-4" />
							<span>
								{course.totalDurationMinutes ?
									Math.round(course.totalDurationMinutes / 60)
								:	0}
								h{" "}
								{(
									course.totalDurationMinutes &&
									course.totalDurationMinutes % 60 > 0
								) ?
									`${course.totalDurationMinutes % 60}m`
								:	""}
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<BookOpen className="h-4 w-4" />
							<span>{course.totalModules || 0} Modules</span>
						</div>
						<div className="flex items-center gap-1.5">
							<User className="h-4 w-4" />
							<span className="truncate max-w-[80px]">
								{course.instructor?.name || "TBA"}
							</span>
						</div>
					</div>
				</div>

				{/* Progress Bar Header */}
				{progressPercentage !== undefined && (
					<div className="absolute bottom-0 left-0 h-1.5 w-full bg-secondary">
						<div
							className="h-full bg-green-500 transition-all duration-500"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				)}
			</div>
		</Link>
	);
}
