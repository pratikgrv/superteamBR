import { BookOpen } from "lucide-react";
import { defineField, defineType } from "sanity";

export const courseType = defineType({
  name: "course",
  title: "Course",
  type: "document",
  icon: BookOpen as any,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "onchainCourseId",
      title: "On-Chain Course ID",
      description: "Must EXACTLY match the ID used to derive the Course PDA on Solana",
      type: "string",
      validation: (rule) => rule.required().regex(/^[a-z0-9-]+$/),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "number",
      options: {
        list: [
          { title: "Beginner", value: 1 },
          { title: "Intermediate", value: 2 },
          { title: "Advanced", value: 3 },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required().integer().min(1).max(3),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Core Blockchain", value: "core" },
          { title: "Smart Contracts (Rust/Anchor)", value: "smart-contracts" },
          { title: "Frontend (Web3.js/React)", value: "frontend" },
          { title: "DeFi (Finance)", value: "defi" },
          { title: "NFTs & Gaming", value: "nfts-gaming" },
          { title: "Security & Auditing", value: "security" },
          { title: "Tooling & Infrastructure", value: "infrastructure" },
          { title: "DAOs & Governance", value: "dao" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Is Active (Published)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "xpPerLesson",
      title: "XP Per Lesson",
      type: "number",
      initialValue: 50,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "track",
      title: "Learning Track",
      type: "reference",
      to: [{ type: "track" }],
      description: "Which curriculum track does this course belong to?",
    }),
    defineField({
      name: "trackLevel",
      title: "Track Level (Order)",
      description: "Is this the 1st, 2nd, or 3rd course in the track?",
      type: "number",
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: "prerequisite",
      title: "Prerequisite Course",
      description: "Optional course required before taking this one",
      type: "reference",
      to: [{ type: "course" }],
    }),
    defineField({
      name: "creatorRewardXp",
      title: "Creator Reward XP",
      type: "number",
      initialValue: 50,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "minCompletionsForReward",
      title: "Min Completions For Reward",
      type: "number",
      initialValue: 3,
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "contentTxId",
      title: "Arweave Content Tx ID",
      description: "Decentralized storage hash for the course content",
      type: "string",
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: [{ type: "instructor" }],
    }),
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      of: [{ type: "reference", to: [{ type: "module" }] }],
    }),
  ],
});
