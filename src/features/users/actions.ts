"use server";

import { db } from "@/drizzle/db";
import { CourseTable, UserTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidateCoursesCache } from "../courses/db-cache";

export const getUser = async (id: string) => {
  "use cache";

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
};

export const togglePublic = async (
  userId: string,
  courseId: string,
  isPublic: boolean
) => {
  try {
    await db
      .update(CourseTable)
      .set({ public: isPublic })
      .where(and(eq(CourseTable.userId, userId), eq(CourseTable.id, courseId)));
    revalidateCoursesCache({ id: courseId, userId });
    return {
      error: false,
    };
  } catch (error) {
    console.error(error);
    return { error: true };
  }
};
