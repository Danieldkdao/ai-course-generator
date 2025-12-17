import { getGlobalTag, getIdTag, getUserTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getCourseGlobalTag = () => {
  return getGlobalTag("courses");
};

export const getCourseUserTag = (userId: string) => {
  return getUserTag("courses", userId);
};

export const getCourseIdTag = (id: string) => {
  return getIdTag("courses", id);
};

export const revalidateCoursesCache = ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  revalidateTag(getCourseGlobalTag(), "max");
  revalidateTag(getCourseUserTag(userId), "max");
  revalidateTag(getCourseIdTag(id), "max");
};
