import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { CourseTable, type CourseChapter } from "@/drizzle/schema";
import { isValidUUID } from "@/drizzle/utils";
import { getCourseIdTag } from "@/features/courses/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { and, eq } from "drizzle-orm";
import { BookXIcon, Clock, Loader2Icon, SearchXIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ContentReview } from "./_client";

const ChapterContentPage = ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <SuspendedCourseContentPage params={params} />
    </Suspense>
  );
};

export default ChapterContentPage;

const SuspendedCourseContentPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const { courseId, chapterId } = await params;
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  if (!isValidUUID(courseId)) {
    return (
      <div className="w-full flex flex-col items-center">
        <Navbar />
        <div className="container flex flex-col gap-4">
          <Card>
            <CardHeader className="space-y-3">
              <div className="size-12 rounded-full bg-primary/10 text-primary">
                <SearchXIcon className="size-6" />
              </div>
              <CardTitle className="text-2xl">Course not found</CardTitle>
              <CardDescription>
                This course either doesn&apos;t exist or you no longer have
                access. Head back to your dashboard to keep building.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/app">Return to dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/app/explore">Browse courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const courseInfo = await getCourseInfo(courseId, userId);

  if (!courseInfo) {
    return (
      <div className="w-full flex flex-col items-center">
        <Navbar />
        <div className="container flex flex-col gap-4">
          <Card>
            <CardHeader className="space-y-3">
              <div className="size-12 rounded-full bg-primary/10 text-primary">
                <SearchXIcon className="size-6" />
              </div>
              <CardTitle className="text-2xl">Course not found</CardTitle>
              <CardDescription>
                This course either doesn&apos;t exist or you no longer have
                access. Head back to your dashboard to keep building.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/app">Return to dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/app/explore">Browse courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentChapter = courseInfo.courseChapters?.find(
    (chapter) => chapter.id === chapterId
  );

  if (!currentChapter) {
    const firstChapterId = courseInfo.courseChapters?.[0]?.id;

    return (
      <div className="w-full flex flex-col items-center gap-4">
        <Navbar />
        <div className="container flex flex-col">
          <Card>
            <CardHeader className="space-y-3">
              <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <BookXIcon className="size-6" />
              </div>
              <CardTitle className="text-2xl">Chapter not found</CardTitle>
              <CardDescription>
                We couldn&apos;t find that chapter. It may have been moved or
                the link is out of date. Pick another chapter to keep learning.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href={`/course/${courseId}`}>
                  Back to course overview
                </Link>
              </Button>
              {firstChapterId ? (
                <Button variant="outline" asChild>
                  <Link href={`/course/${courseId}/${firstChapterId}`}>
                    Open first chapter
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/app">Return to dashboard</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <SidebarLinks
          courseId={courseId}
          courseTitle={courseInfo.title}
          courseChapters={courseInfo.courseChapters}
          chapterId={chapterId}
        />
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{currentChapter.title}</h1>
              <p className="text-muted-foreground text-sm">
                {currentChapter.description}
              </p>
              {courseInfo.includeVideos && (
                <iframe
                  title="chapter video"
                  className="w-full mt-4 aspect-video max-h-[24rem]"
                  src={
                    currentChapter.video === null ? "" : currentChapter.video
                  }
                />
              )}
              <hr />
              <MarkdownRenderer
                content={
                  currentChapter.content
                    ? currentChapter.content
                    : "#No Content Found"
                }
              />
            </div>
            <hr />
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Content Review</h1>
              <ContentReview
                contentReview={currentChapter.contentReview ?? []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarLinks = ({
  courseId,
  courseTitle,
  courseChapters,
  chapterId,
}: {
  courseId: string;
  courseTitle: string;
  courseChapters: CourseChapter[] | null;
  chapterId: string;
}) => {
  if (courseChapters == null) return null;
  return (
    <div className="w-72 overflow-y-auto border-r-2">
      <h1 className="text-primary-foreground text-xl font-bold p-2 bg-primary">
        {courseTitle}
      </h1>
      {courseChapters.map((chapter) => {
        const isSelected = chapterId === chapter.id;
        console.log(isSelected);
        return (
          <Link href={`/course/${courseId}/${chapter.id}`} key={chapter.id}>
            <div
              className={cn(
                "flex items-center gap-4 p-2 border-b-2",
                isSelected ? "bg-primary/20" : "hover:bg-primary/5 transition"
              )}
            >
              <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                <h1 className="text-xl font-bold text-primary-foreground">
                  {chapter.chapterNumber}
                </h1>
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{chapter.title}</h1>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary size-4" />
                  <p className="text-primary">{chapter.time} minutes</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const getCourseInfo = async (id: string, userId: string) => {
  "use cache";
  cacheTag(getCourseIdTag(id));
  return db.query.CourseTable.findFirst({
    where: and(eq(CourseTable.id, id), eq(CourseTable.userId, userId)),
  });
};
