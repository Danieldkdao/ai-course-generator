"use server";

import { aiGenerateCourseLayout } from "@/features/courses/ai";
import type { CreateNewFormData } from "./components/create-new";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import crypto from "crypto";
import { revalidateCoursesCache } from "./db-cache";

export const createNewCourseLayout = async (courseSpecs: CreateNewFormData) => {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();
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
  return {
    error: false,
    message: "Course layout generated successfully!",
    id: insert[0].id,
  };
};
