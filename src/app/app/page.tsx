import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { CreateNewCourse } from "@/features/courses/components/create-new";
import { getCourseUserTag } from "@/features/courses/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { desc, eq } from "drizzle-orm";
import { Loader2Icon, Layers3Icon, BookOpen, PenIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import {
  categories,
  difficulties,
  durations,
  includeVideosOptions,
} from "@/features/courses/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AppPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <SuspendedApp />
    </Suspense>
  );
};

export default AppPage;

const SuspendedApp = async () => {
  const { userId, redirectToSignIn, user } = await getCurrentUser({
    allData: true,
  });
  if (userId == null || !user) return redirectToSignIn();
  const courses = await getUserCourses(userId);
  if (courses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl">
            Hello, <span className="font-extrabold">{user.name}</span>
          </h1>
          <p className="./">
            Create a new course with AI, share it with your friends, and earn
            rewards.
          </p>
        </div>
        <Card>
          <CardHeader className="space-y-2">
            <Layers3Icon className="size-14" />
            <CardTitle className="text-2xl">No courses yet</CardTitle>
            <CardDescription className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground max-w-[400px]">
                Create your first AI-powered course and share it in minutes. We
                will generate an outline, lessons, and resources for you. You
                can tweak everything before publishing.
              </p>
              <CreateNewCourse />
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl">
            Hello, <span className="font-extrabold">{user.name}</span>
          </h1>
          <p className="./">
            Create a new course with AI, share it with your friends, and earn
            rewards.
          </p>
        </div>
        <CreateNewCourse />
      </div>
      <div className="space-y-2 mt-4">
        <h1 className="text-xl font-medium ">My Courses</h1>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course) => {
            const CategoryIcon =
              categories.find((ct) => ct.value === course.category)?.Icon ??
              PenIcon;
            const DifficultyIcon =
              difficulties.find((ct) => ct.value === course.difficultyLevel)
                ?.Icon ?? PenIcon;
            const DurationIcon =
              durations.find((ct) => ct.value === course.duration)?.Icon ??
              PenIcon;
            const IncludeVideoIcon =
              includeVideosOptions.find(
                (ct) => ct.value === String(course.includeVideos)
              )?.Icon ?? PenIcon;
            return (
              <Card key={course.id}>
                <CardHeader>
                  <div className="">
                    <div className="w-full h-32 bg-primary/70 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-primary-foreground size-12" />
                    </div>
                  </div>
                  <CardTitle className="leading-5">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <CategoryIcon className="size-4" />
                      <span className="capitalize">
                        {course.category === "ai" ? "AI" : course.category}
                      </span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <DifficultyIcon className="size-4" />
                      <span className="capitalize">
                        {course.difficultyLevel}
                      </span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <DurationIcon className="size-4" />
                      <span className="capitalize">{course.duration}</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <IncludeVideoIcon className="size-4" />
                      <span>
                        {course.includeVideos ? "Videos Included" : "No Videos"}
                      </span>
                    </Badge>
                    <Badge>
                      {course.contentGenerated ? course.public ? "Public" : "Private" : "No content yet"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/app/create-course/${course.id}`}>
                      {course.contentGenerated
                        ? "Manage course"
                        : "Generate content"}
                    </Link>
                  </Button>
                  {course.contentGenerated && (
                    <Button className="w-full" asChild>
                      <Link href={`/course/${course.id}`}>Go to course</Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getUserCourses = async (userId: string) => {
  "use cache";
  cacheTag(getCourseUserTag(userId));
  return db.query.CourseTable.findMany({
    where: eq(CourseTable.userId, userId),
    orderBy: desc(CourseTable.createdAt),
  });
};
