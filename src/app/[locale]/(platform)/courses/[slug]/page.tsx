type Props = {
	params: Promise<{ slug: string }>;
};

export default async function CourseDetail({ params }: Props) {
	const { slug } = await params;

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold">Course: {slug}</h1>
			<p className="mt-4 text-gray-600">Course description will go here.</p>
		</div>
	);
}
