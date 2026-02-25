import { codeInput } from "@sanity/code-input";
//import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  title: "Superteam BR Admin",

  plugins: [structureTool(), codeInput()],

  schema: {
    types: schema.types,
  },
});
