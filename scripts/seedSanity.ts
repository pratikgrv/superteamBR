import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
	console.error(
		"Missing required environment variables. Please check NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN in .env.local.",
	);
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: "2024-02-22",
	useCdn: false,
	token,
});

async function main() {
	console.log("Starting Sanity seeding process...");

	try {
		// 1. Create an Instructor
		console.log("Creating instructor...");
		const instructor = await client.create({
			_type: "instructor",
			name: "Satoshi Nakamoto",
			bio: "Creator of Bitcoin and honorable blockchain pioneer.",
			socials: {
				twitter: "https://twitter.com/satoshi",
			},
		});
		console.log(`Instructor created: ${instructor._id}`);

		// 2. Create Lessons
		console.log("Creating lessons...");
		const lesson1 = await client.create({
			_type: "lesson",
			title: "Introduction to Blockchain",
			lessonType: "content",
			description: "Learn the fundamentals of distributed ledgers.",
			durationMinutes: 10,
			content: [
				{
					_type: "block",
					children: [
						{
							_type: "span",
							text: "Blockchain represents a paradigm shift...",
						},
					],
				},
			],
		});
		console.log(`Lesson 1 created: ${lesson1._id}`);

		const lesson2 = await client.create({
			_type: "lesson",
			title: "Writing your first Smart Contract",
			lessonType: "challenge",
			description: "Interactive coding challenge using Rust.",
			durationMinutes: 45,
			content: [
				{
					_type: "block",
					children: [
						{ _type: "span", text: "Now apply what you've learned below:" },
					],
				},
				{
					_type: "code",
					code: 'fn main() {\n  println!("Hello, Solana!");\n}',
					language: "rust",
				},
			],
		});
		console.log(`Lesson 2 created: ${lesson2._id}`);

		// 3. Create a Module containing the Lessons
		console.log("Creating module...");
		const module1 = await client.create({
			_type: "module",
			title: "Module 1: Getting Started",
			description: "Your first steps into Web3.",
			lessons: [
				{ _type: "reference", _ref: lesson1._id },
				{ _type: "reference", _ref: lesson2._id },
			],
		});
		console.log(`Module created: ${module1._id}`);

		// 4. Create the final Course referencing the Instructor and Modules
		console.log("Creating course...");
		const course = await client.create({
			_type: "course",
			title: "Mastering Web3 Development",
			slug: { _type: "slug", current: "mastering-web3-development" },
			description:
				"A comprehensive guide to building decentralized applications.",
			difficulty: 2, // Intermediate
			isActive: true,
			xpPerLesson: 100,
			trackId: 1,
			trackLevel: 1,
			creatorRewardXp: 500,
			minCompletionsForReward: 5,
			topics: ["Rust", "Smart Contracts", "DeFi"],
			instructor: { _type: "reference", _ref: instructor._id },
			modules: [{ _type: "reference", _ref: module1._id }],
		});
		console.log(`Course created successfully: ${course._id}`);

		console.log("✅ Seeding entirely completed!");
	} catch (err) {
		console.error("An error occurred during seeding:", err);
	}
}

main();
