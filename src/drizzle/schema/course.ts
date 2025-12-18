import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";

export const courseCategories = [
  "math",
  "science",
  "programming",
  "creative",
  "ai",
  "human",
] as const;
export type CourseCategories = (typeof courseCategories)[number];
export const CourseCategoryEnum = pgEnum("course_category", courseCategories);

export const difficultyLevels = ["easy", "medium", "hard"] as const;
export type DifficultyLevels = (typeof difficultyLevels)[number];
export const DifficultyLevelEnum = pgEnum(
  "course_difficulty_level",
  difficultyLevels
);

export const courseDurations = ["1 hour", "2 hours", "3+ hours"] as const;
export type CourseDurations = (typeof difficultyLevels)[number];
export const CourseDurationEnum = pgEnum("course_duration", courseDurations);

export type ReviewQuestions = {
  question: string;
  options: [string, string, string, string];
  answer: string;
};

export type CourseChapter = {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  time: number;
  video: string | null;
  content: string | null;
  contentReview: ReviewQuestions[] | null;
};

export const CourseTable = pgTable("courses", {
  id: uuid().primaryKey().defaultRandom(),
  userId: varchar().references(() => UserTable.id, { onDelete: "cascade" }),
  category: CourseCategoryEnum().notNull(),
  topic: varchar({ length: 255 }).notNull(),
  details: varchar().notNull(),
  difficultyLevel: DifficultyLevelEnum().notNull(),
  duration: CourseDurationEnum().notNull(),
  includeVideos: boolean().notNull(),
  numberOfChapters: integer().notNull(),
  image: varchar(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  courseChapters: jsonb("chapters").$type<CourseChapter[]>(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const coursesRelations = relations(CourseTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [CourseTable.userId],
    references: [UserTable.id],
  }),
}));
