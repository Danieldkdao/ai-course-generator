import { auth } from "@clerk/nextjs/server";

type Permission =
  | "unlimited_chapters_per_course"
  | "unlimited_course_generations"
  | "4_chapters_per_course"
  | "5_course_generations";

export const hasPermission = async (permission: Permission) => {
  const { has } = await auth();
  return has({ feature: permission });
};
