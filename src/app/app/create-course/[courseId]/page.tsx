import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { isValidUUID } from "@/drizzle/utils";
import { getCourseIdTag } from "@/features/courses/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { and, eq } from "drizzle-orm";
import {
  BookOpen,
  ChartColumnBigIcon,
  CirclePlay,
  Clock,
  ImageUpIcon,
  Loader2Icon,
  SearchXIcon,
} from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { CourseInfoClient } from "./_client";

const CreateCoursePage = ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <SuspendedCoursePage params={params} />
    </Suspense>
  );
};

export default CreateCoursePage;

const SuspendedCoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  if (!isValidUUID(courseId)) {
    return (
      <Card>
        <CardHeader className="space-y-3">
          <div className="size-12 rounded-full bg-primary/10 text-primary">
            <SearchXIcon className="size-6" />
          </div>
          <CardTitle className="text-2xl">Course not found</CardTitle>
          <CardDescription>
            This course either doesn&apos;t exist or you no longer have access.
            Head back to your dashboard to keep building.
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
    );
  }

  const courseInfo = await getCourseInfo(courseId, userId);

  if (!courseInfo) {
    return (
      <Card>
        <CardHeader className="space-y-3">
          <div className="size-12 rounded-full bg-primary/10 text-primary">
            <SearchXIcon className="size-6" />
          </div>
          <CardTitle className="text-2xl">Course not found</CardTitle>
          <CardDescription>
            This course either doesn&apos;t exist or you no longer have access.
            Head back to your dashboard to keep building.
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
    );
  }

  const courseSpecs = [
    {
      text: "Difficulty Level",
      value: courseInfo.difficultyLevel,
      Icon: ChartColumnBigIcon,
    },
    {
      text: "Duration",
      value: courseInfo.duration,
      Icon: Clock,
    },
    {
      text: "No. of Chapters",
      value: courseInfo.numberOfChapters,
      Icon: BookOpen,
    },
    {
      text: "Videos Included?",
      value: courseInfo.includeVideos ? "Yes" : "No",
      Icon: CirclePlay,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h1 className="text-xl font-extrabold">Course Layout</h1>
      <Card className="grid grid-cols-2 gap-4 w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {courseInfo.title}
          </CardTitle>
          <CardDescription>{courseInfo.description}</CardDescription>
          <Badge className="capitalize">
            {courseInfo.category === "ai" ? "AI" : courseInfo.category}
          </Badge>
        </CardHeader>
        <CardContent className="">
          <div className="w-full h-full bg-primary/70 rounded-lg flex items-center justify-center border-4 border-dashed cursor-pointer hover:border-primary transition">
            <ImageUpIcon className="text-primary-foreground size-24" />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent>
          <div className="grid grid-cols-4 w-full">
            {courseSpecs.map(({ text, value, Icon }) => (
              <div key={value} className="flex items-center gap-2">
                <Icon className="size-10" />
                <div className="">
                  <p className="text-sm">{text}</p>
                  <p className="text-lg font-bold capitalize">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <h1 className="text-xl font-extrabold">Chapters</h1>
      <CourseInfoClient
        userId={userId}
        courseId={courseId}
        courseChapters={courseInfo.courseChapters}
        hasGeneratedCourseContent={courseInfo.contentGenerated}
        isPublic={courseInfo.public}
      />
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
