type Props = {
	params: Promise<{ id: string }>;
};

export default async function CertificateDetail({ params }: Props) {
	const { id } = await params;

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold">Certificate: {id}</h1>
			<p className="mt-4 text-gray-600">View and verify on-chain credential.</p>
		</div>
	);
}
