import type { SchemaTypeDefinition } from "sanity";
import { courseType } from "./courseType";
import { instructorType } from "./instructorType";
import { lessonType } from "./lessonType";
import { moduleType } from "./moduleType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [instructorType, lessonType, moduleType, courseType],
};
