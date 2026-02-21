type Props = {
	params: Promise<{ slug: string; id: string }>;
};

export default async function LessonDetail({ params }: Props) {
	const { slug, id } = await params;

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold">
				Course: {slug} | Lesson: {id}
			</h1>
			<p className="mt-4 text-gray-600">
				Left side content, right side editor.
			</p>
		</div>
	);
}
