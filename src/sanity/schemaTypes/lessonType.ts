import { FileVideo } from "lucide-react";
import { defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: FileVideo as any,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lessonType",
      title: "Lesson Type",
      type: "string",
      options: {
        list: [
          { title: "Content (Reading/Video)", value: "content" },
          { title: "Challenge (Interactive Coding)", value: "challenge" },
        ],
        layout: "radio",
      },
      initialValue: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "durationMinutes",
      title: "Duration (minutes)",
      type: "number",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
    }),
    defineField({
      name: "language",
      title: "Programming Language",
      type: "string",
      options: {
        list: [
          { title: "Rust", value: "rust" },
          { title: "TypeScript", value: "typescript" },
        ]
      },
      hidden: ({ document }) => document?.lessonType !== "challenge",
    }),
    defineField({
      name: "starterCode",
      title: "Starter Code",
      type: "code",
      hidden: ({ document }) => document?.lessonType !== "challenge",
    }),
    defineField({
      name: "solutionCode",
      title: "Solution Code",
      type: "code",
      hidden: ({ document }) => document?.lessonType !== "challenge",
    }),
    defineField({
      name: "testCases",
      title: "Test Cases",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "input", type: "string", title: "Input/Test Name" },
            { name: "expectedOutput", type: "text", title: "Expected Output/Condition" },
            { name: "isHidden", type: "boolean", title: "Hidden Test Case?", initialValue: false }
          ]
        }
      ],
      hidden: ({ document }) => document?.lessonType !== "challenge",
    }),
    defineField({
      name: "content",
      title: "Written Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "code",
          title: "Code Block",
          options: {
            withFilename: true,
          },
        },
      ],
      hidden: ({ document }) => document?.lessonType !== "content",
    }),
  ],
});
