import { db } from "@/drizzle/db";
import { CourseTable, type ReviewQuestions } from "@/drizzle/schema";
import { aiGenerateCourseContent } from "@/features/courses/ai";
import {
  getCourseIdTag,
  revalidateCoursesCache,
} from "@/features/courses/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { getChapterVideo } from "@/services/youtube/get-video";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { after } from "next/server";

export const POST = async (req: Request) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (userId == null || !user) {
    return new Response("You are not signed in", { status: 401 });
  }
  if (process.env.NODE_ENV === "production" && !user.canCreateCourse) {
    return new Response("You do not have access in production mode.");
  }
  const formData = await req.formData();
  const courseId = formData.get("courseId") as string;
  const courseInfo = await getCourseInfo(courseId, userId);
  if (!courseInfo) {
    return new Response("You don't have permission to do this", {
      status: 401,
    });
  }
  if (courseInfo.courseChapters === null) {
    return new Response("You must generate a layout first", { status: 400 });
  }
  const videoPromises = courseInfo.courseChapters.map((chapter) =>
    getChapterVideo(chapter.query)
  );
  const videoIds = courseInfo.includeVideos
    ? await Promise.all(videoPromises)
    : Array.from({ length: courseInfo.courseChapters.length }, (_) => null);
  const stream = await aiGenerateCourseContent(courseInfo);
  if (stream === null) {
    return new Response("You must generate a layout first", { status: 400 });
  }
  const response = stream.toTextStreamResponse();

  after(async () => {
    const chapters = await stream.object;
    const mergedChapters = courseInfo.courseChapters!.map((chapter, idx) => ({
        ...chapter,
        content: chapters[idx]?.content ?? null,
        contentReview:
          (chapters[idx]?.contentReview as ReviewQuestions[]) ?? null,
        video: videoIds[idx] ?? chapter.video ?? null,
      }));
      await db
        .update(CourseTable)
        .set({ courseChapters: mergedChapters, contentGenerated: true })
        .where(
          and(eq(CourseTable.id, courseId), eq(CourseTable.userId, userId))
        );
      revalidateCoursesCache({ id: courseId, userId });
  })

  return response;
};

const getCourseInfo = async (id: string, userId: string) => {
  "use cache";
  cacheTag(getCourseIdTag(id));
  return db.query.CourseTable.findFirst({
    where: and(eq(CourseTable.id, id), eq(CourseTable.userId, userId)),
  });
};
