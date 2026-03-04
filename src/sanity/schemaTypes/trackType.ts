import { MapIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const trackType = defineType({
  name: "track",
  title: "Learning Track",
  type: "document",
  icon: MapIcon as any,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g., 'Solana Fundamentals' or 'DeFi Developer'",
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
      name: "description",
      title: "Description",
      type: "text",
      description: "A short summary of what the learner will achieve in this track.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Track Image / Badge",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "This artwork is used as the base for the Metaplex Core NFT credential.",
    }),
    defineField({
      name: "courses",
      title: "Courses in this Track",
      type: "array",
      description: "The ordered list of courses that make up this track.",
      of: [
        {
          type: "reference",
          to: [{ type: "course" }],
        },
      ],
      validation: (rule) => rule.unique(),
    }),
   
    defineField({
      name: "collectionAddress",
      title: "On-Chain Collection Address",
      type: "string",
      description: "The Metaplex Core Collection public key for this track's credential NFTs.",
    }),
  ],
});
