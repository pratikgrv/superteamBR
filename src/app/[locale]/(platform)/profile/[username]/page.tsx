type Props = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfile({ params }: Props) {
  const { username } = await params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Profile: {username}</h1>
      <p className="mt-4 text-gray-600">Public profile details.</p>
    </div>
  );
}
