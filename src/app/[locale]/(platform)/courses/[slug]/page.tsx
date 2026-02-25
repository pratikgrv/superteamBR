import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CourseHeader } from "@/components/course/CourseHeader";
import { ModuleList } from "@/components/course/ModuleList";
import { ReviewSection } from "@/components/course/ReviewSection";
import { Link } from "@/lib/i18n/routing";
import { mockUserProgress } from "@/lib/data/courses";
import { client } from "@/sanity/lib/client";
import { COURSE_BY_SLUG_QUERY } from "@/sanity/lib/queries";

type Props = {
	params: Promise<{ slug: string }>;
};

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function CourseDetail({ params }: Props) {
	const { slug } = await params;

	// Fetch course from Sanity
	const course = await client.fetch(COURSE_BY_SLUG_QUERY, { slug });

	if (!course) {
		notFound();
	}

	// Check enrollment status (mocked for now, until DB interaction is set up)
	const userProgress = mockUserProgress.find((p) => p.courseId === course._id);
	const enrolled = !!userProgress;

	return (
		<div className="container mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen max-w-5xl">
			{/* Back navigation */}
			<div className="mb-6">
				<Link
					href="/courses"
					className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Courses
				</Link>
			</div>

			<CourseHeader course={course} enrolled={enrolled} />

			<div className="mt-8 space-y-12">
				<ModuleList course={course} userProgress={userProgress} />
				{/* We will leave reviews static for now or extract from Sanity if added to schema later */}
				{course.reviews && course.reviews.length > 0 && (
					<ReviewSection reviews={course.reviews} />
				)}
			</div>
		</div>
	);
}
