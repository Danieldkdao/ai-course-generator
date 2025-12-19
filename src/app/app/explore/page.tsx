import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { getCourseGlobalTag } from "@/features/courses/db-cache";
import {
  categories,
  difficulties,
  durations,
  includeVideosOptions,
} from "@/features/courses/utils";
import UserAvatar from "@/features/users/components/user-avatar";
import { BookOpen, PenIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

const ExplorePage = () => {
  return (
    <Suspense>
      <SuspendedExplorePage />
    </Suspense>
  );
};

export default ExplorePage;

const SuspendedExplorePage = async () => {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-3 gap-4">
      {courses.map((course) => {
        const CategoryIcon =
          categories.find((ct) => ct.value === course.category)?.Icon ??
          PenIcon;
        const DifficultyIcon =
          difficulties.find((ct) => ct.value === course.difficultyLevel)
            ?.Icon ?? PenIcon;
        const DurationIcon =
          durations.find((ct) => ct.value === course.duration)?.Icon ?? PenIcon;
        const IncludeVideoIcon =
          includeVideosOptions.find(
            (ct) => ct.value === String(course.includeVideos)
          )?.Icon ?? PenIcon;
        return (
          <Link key={course.id} href={`/course/${course.id}`}>
            <Card>
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
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CategoryIcon className="size-4" />
                    <span className="capitalize">
                      {course.category === "ai" ? "AI" : course.category}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DifficultyIcon className="size-4" />
                    <span className="capitalize">{course.difficultyLevel}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DurationIcon className="size-4" />
                    <span className="capitalize">{course.duration}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
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
  );
};

const getAllCourses = async () => {
  "use cache";
  cacheTag(getCourseGlobalTag());
  return db.query.CourseTable.findMany({
    with: {
      user: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });
};
