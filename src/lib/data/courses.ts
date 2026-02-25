export type CourseDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Instructor {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  videoUrl?: string;
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: CourseDifficulty;
  topics: string[];
  instructor: Instructor;
  modules: Module[];
  reviews: Review[];
  totalDurationMinutes: number;
  totalXp: number;
}

// Simulated User Progress
export interface UserCourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  progressPercentage: number;
}

export const demoCourses: Course[] = [
  {
    id: "course-1",
    slug: "solana-fundamentals",
    title: "Solana Fundamentals",
    description:
      "Master the basics of Solana development. Learn about accounts, programs, PDAs, and how to build your first decentralized application.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800",
    difficulty: "Beginner",
    topics: ["Solana", "Rust", "Web3"],
    instructor: {
      id: "inst-1",
      name: "Superteam Brazil",
      avatarUrl: "https://github.com/superteambr.png",
    },
    totalDurationMinutes: 120,
    totalXp: 500,
    modules: [
      {
        id: "mod-1",
        title: "Introduction to Solana",
        lessons: [
          {
            id: "les-1",
            title: "What is Solana?",
            durationMinutes: 10,
            xpReward: 50,
          },
          {
            id: "les-2",
            title: "Setting up your environment",
            durationMinutes: 15,
            xpReward: 50,
          },
          {
            id: "les-3",
            title: "The Solana Account Model",
            durationMinutes: 20,
            xpReward: 100,
          },
        ],
      },
      {
        id: "mod-2",
        title: "Writing Programs in Rust",
        lessons: [
          {
            id: "les-4",
            title: "Introduction to Anchor",
            durationMinutes: 25,
            xpReward: 100,
          },
          {
            id: "les-5",
            title: "Building a Counter Program",
            durationMinutes: 50,
            xpReward: 200,
          },
        ],
      },
    ],
    reviews: [
      {
        id: "rev-1",
        userId: "u1",
        userName: "Alice Developer",
        rating: 5,
        comment: "Amazing course! Clarified PDAs perfectly.",
        createdAt: "2024-01-10T10:00:00Z",
      },
      {
        id: "rev-2",
        userId: "u2",
        userName: "Bob Builder",
        rating: 4,
        comment: "Good introduction, looking forward to advanced topics.",
        createdAt: "2024-01-15T14:30:00Z",
      },
    ],
  },
  {
    id: "course-2",
    slug: "defi-developer-crash-course",
    title: "DeFi Developer Crash Course",
    description:
      "Learn how to build Decentralized Finance applications. We cover AMMs, Lending protocols, and tokenomics on Solana.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800",
    difficulty: "Advanced",
    topics: ["DeFi", "Solana", "Anchor"],
    instructor: {
      id: "inst-2",
      name: "DeFi Chad",
    },
    totalDurationMinutes: 240,
    totalXp: 1200,
    modules: [
      {
        id: "mod-3",
        title: "Core Concepts",
        lessons: [
          {
            id: "les-6",
            title: "What is an AMM?",
            durationMinutes: 30,
            xpReward: 150,
          },
          {
            id: "les-7",
            title: "Liquidity Pools explained",
            durationMinutes: 45,
            xpReward: 250,
          },
        ],
      },
    ],
    reviews: [],
  },
  {
    id: "course-3",
    slug: "intro-to-typescript-for-web3",
    title: "TypeScript for Web3",
    description:
      "A fast-paced guide to TypeScript specifically tailored for Web3 developers interacting with smart contracts.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1607799279861-4dddf847bf5a?auto=format&fit=crop&q=80&w=800",
    difficulty: "Beginner",
    topics: ["TypeScript", "Frontend"],
    instructor: {
      id: "inst-1",
      name: "Superteam Brazil",
    },
    totalDurationMinutes: 90,
    totalXp: 300,
    modules: [
      {
        id: "mod-4",
        title: "Basics",
        lessons: [
          {
            id: "les-8",
            title: "Types vs Interfaces",
            durationMinutes: 20,
            xpReward: 100,
          },
          {
            id: "les-9",
            title: "Generics in Web3 SDKs",
            durationMinutes: 70,
            xpReward: 200,
          },
        ],
      },
    ],
    reviews: [],
  },
];

export const mockUserProgress: UserCourseProgress[] = [
  {
    userId: "demo-user",
    courseId: "course-1",
    enrolledAt: "2024-02-01T00:00:00Z",
    completedLessonIds: ["les-1", "les-2"],
    progressPercentage: 40,
  },
];
