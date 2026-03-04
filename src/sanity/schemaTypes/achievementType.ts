import { Award } from "lucide-react";
import { defineField, defineType } from "sanity";

export const achievementType = defineType({
  name: "achievement",
  title: "Achievement",
  type: "document",
  icon: Award as any,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "onchainAchievementId",
      title: "On-Chain Achievement ID",
      description: "Must EXACTLY match the achievement_id used to derive the AchievementType PDA on Solana",
      type: "string",
      validation: (rule) => rule.required().regex(/^[a-z0-9-]+$/),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "How to earn this achievement",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Badge Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "This artwork is used for the Metaplex Core NFT metadata URI.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Progress", value: "progress" },
          { title: "Streaks", value: "streaks" },
          { title: "Skills", value: "skills" },
          { title: "Community", value: "community" },
          { title: "Special", value: "special" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "xpReward",
      title: "XP Reward",
      description: "The amount of XP awarded (visual only, the true amount is defined on-chain)",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
  ],
});
