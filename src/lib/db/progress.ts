import { pgTable, text, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./schema";

export const courseEnrollments = pgTable("course_enrollments", {
  userId: text("user_id").notNull().references(() => user.id),
  courseId: text("course_id").notNull(), // Sanity course ID
  status: text("status", { enum: ["enrolled", "completed"] }).default("enrolled"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  currentLessonId: text("current_lesson_id"),
  progress: integer("progress").default(0), // percentage 0-100
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.courseId] }),
}));

export const lessonProgress = pgTable("lesson_progress", {
  userId: text("user_id").notNull().references(() => user.id),
  courseId: text("course_id").notNull(),
  lessonId: text("lesson_id").notNull(), // Sanity lesson ID
  completed: timestamp("completed_at"),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.lessonId] }),
}));
