"use server";

import { aiGenerateCourseLayout } from "@/features/courses/ai";
import type { CreateNewFormData } from "./components/create-new";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { db } from "@/drizzle/db";
import { CourseTable, UserTable } from "@/drizzle/schema";
import crypto from "crypto";
import { revalidateCoursesCache } from "./db-cache";
import { eq, sql } from "drizzle-orm";
import { canCreateCourse } from "./permissions";
import { hasPermission } from "@/services/clerk/lib/has-permission";
import arcjet, { request, tokenBucket } from "@arcjet/next";
import { env } from "@/data/env/server";
import { revalidateUserCache } from "../users/db-cache";

const aj = arcjet({
  characteristics: ["userId"],
  key: env.ARCJET_KEY,
  rules: [
    tokenBucket({
      capacity: 12,
      refillRate: 4,
      interval: "1d",
      mode: "LIVE",
    }),
  ],
});

export const createNewCourseLayout = async (courseSpecs: CreateNewFormData) => {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();
  if (!(await canCreateCourse())) {
    return {
      error: true,
      message: "You have reached you plan limit. Please upgrade.",
      upgrade: true,
    };
  }
  if (
    courseSpecs.numberOfChapters > 4 &&
    !(await hasPermission("unlimited_chapters_per_course"))
  ) {
    return {
      error: true,
      message: "Please upgrade to get more chapters.",
      upgrade: true,
    };
  }
  const decision = await aj.protect(await request(), {
    userId,
    requested: 1,
  });
  if (decision.isDenied()) {
    return {
      error: true,
      message: "You have made too many requests. Please try again later.",
    };
  }
  const response = await aiGenerateCourseLayout(courseSpecs);
  if (response == null) {
    return {
      error: true,
      message: "Failed to generate course layout.",
    };
  }
  const insert = await db
    .insert(CourseTable)
    .values({
      userId,
      category: courseSpecs.category,
      topic: courseSpecs.topic,
      details: courseSpecs.details,
      difficultyLevel: courseSpecs.difficultyLevel,
      duration: courseSpecs.duration,
      includeVideos: courseSpecs.includeVideos,
      numberOfChapters: courseSpecs.numberOfChapters,
      title: response.title,
      description: response.description,
      public: true,
      contentGenerated: false,
      courseChapters: response.courseChapters.map((chap) => ({
        ...chap,
        id: String(chap.chapterNumber) + crypto.randomBytes(2).toString("hex"),
        video: null,
        content: null,
        contentReview: null,
      })),
    })
    .returning({
      id: CourseTable.id,
    });
  if (insert[0].id == null) {
    return {
      error: true,
      message: "Failed to generate course layout.",
    };
  }
  revalidateCoursesCache({ id: insert[0].id, userId });
  revalidateUserCache(userId);
  await db
    .update(UserTable)
    .set({ coursesCreated: sql`${UserTable.coursesCreated} + 1` })
    .where(eq(UserTable.id, userId));
  return {
    error: false,
    message: "Course layout generated successfully!",
    id: insert[0].id,
  };
};
