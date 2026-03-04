import type { SchemaTypeDefinition } from "sanity";
import { achievementType } from "./achievementType";
import { courseType } from "./courseType";
import { instructorType } from "./instructorType";
import { lessonType } from "./lessonType";
import { moduleType } from "./moduleType";
import { trackType } from "./trackType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [instructorType, lessonType, moduleType, courseType, achievementType, trackType],
};
