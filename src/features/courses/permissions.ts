import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { hasPermission } from "@/services/clerk/lib/has-permission";
import { eq } from "drizzle-orm";

export const canCreateCourse = async () => {
  return await Promise.any([
    hasPermission("unlimited_course_generations").then(
      (bool) => bool || Promise.reject()
    ),
    Promise.all([
      hasPermission("5_course_generations"),
      getUserCourseGenerationCount(),
    ]).then(([has, c]) => {
      if (has && c < 5) return true;
      return Promise.reject();
    }),
  ]).catch(() => false);
};

const getUserCourseGenerationCount = async () => {
  const { userId } = await getCurrentUser();
  if (userId == null) return 0;
  return getCourseGenerationCount(userId);
};

const getCourseGenerationCount = async (userId: string) => {
  const course = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });
  return course?.coursesCreated ?? 0;
};
