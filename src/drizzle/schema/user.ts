import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { CourseTable } from "./course";

export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  imageUrl: varchar().notNull(),
  coursesCreated: integer().notNull(),
  canCreateCourse: boolean().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(UserTable, ({ many }) => ({
  courses: many(CourseTable),
}));
