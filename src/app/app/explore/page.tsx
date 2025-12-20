import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { getCourseGlobalTag } from "@/features/courses/db-cache";
import {
  categories,
  difficulties,
  durations,
  includeVideosOptions,
} from "@/features/courses/utils";
import UserAvatar from "@/features/users/components/user-avatar";
import { and, desc, eq } from "drizzle-orm";
import { BookOpen, Loader2Icon, PenIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";

const ExplorePage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <SuspendedExplorePage />
    </Suspense>
  );
};

export default ExplorePage;

const SuspendedExplorePage = async () => {
  const courses = await getAllCourses();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Explore Courses</h1>
        <p className="text-muted-foreground text-sm">
          Learn from a variety of courses created by the community of course
          creators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <Link key={course.id} href={`/course/${course.id}`}>
              <Card className="h-full">
                <CardHeader>
                  {course?.image?.url ? (
                    <div className="w-full h-32 relative rounded-lg overflow-hidden">
                      <Image
                        src={course.image.url}
                        alt="Image url"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="w-full h-32 bg-primary/70 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-primary-foreground size-12" />
                      </div>
                    </div>
                  )}
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
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      user={{
                        name: course.user?.name ?? "",
                        imageUrl: course.user?.imageUrl ?? "",
                      }}
                    />
                    <span className="font-medium">
                      {course.user?.name ?? "Unknown"}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const getAllCourses = async () => {
  "use cache";
  cacheTag(getCourseGlobalTag());
  return db.query.CourseTable.findMany({
    where: and(
      eq(CourseTable.public, true),
      eq(CourseTable.contentGenerated, true)
    ),
    with: {
      user: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: desc(CourseTable.createdAt),
  });
};
