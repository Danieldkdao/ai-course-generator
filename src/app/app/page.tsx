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
import { getCourseUserTag } from "@/features/courses/db-cache";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { eq } from "drizzle-orm";
import { Loader2Icon, PlusIcon, Layers3Icon } from "lucide-react";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

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
              <Button className="flex items-center gap-2 cursor-pointer">
                <PlusIcon className="size-4" />
                <span>Create a course</span>
              </Button>
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
        <Button className="flex items-center gap-2 cursor-pointer">
          <PlusIcon />
          <span>Create New Course</span>
        </Button>
      </div>
    </div>
  );
};

const getUserCourses = async (userId: string) => {
  "use cache";
  cacheTag(getCourseUserTag(userId));
  return db.query.CourseTable.findMany({
    where: eq(CourseTable.userId, userId),
  });
};
