"use client";

import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Switch } from "@/components/ui/switch";
import { env } from "@/data/env/client";
import type { CourseChapter } from "@/drizzle/schema";
import { deleteCourse } from "@/features/courses/actions";
import { togglePublic } from "@/features/users/actions";
import { courseContentSchema } from "@/services/ai/schemas";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Check, ClipboardCheckIcon, Clock, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const CourseInfoClient = ({
  userId,
  courseId,
  courseChapters,
  hasGeneratedCourseContent,
  isPublic,
}: {
  userId: string;
  courseId: string;
  courseChapters: CourseChapter[] | null;
  hasGeneratedCourseContent: boolean;
  isPublic: boolean;
}) => {
  const [isPublicState, setIsPublicState] = useState(isPublic);
  const [isFinished, setIsFinished] = useState(hasGeneratedCourseContent);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const {
    object: courseGeneration,
    isLoading,
    submit: generateCourseContent,
  } = useObject({
    api: "/api/ai/courses/generate-content",
    schema: courseContentSchema,
    fetch: (url, options) => {
      const headers = new Headers(options?.headers);
      headers.delete("Content-Type");
      const formData = new FormData();
      formData.append("courseId", courseId);
      return fetch(url, { ...options, headers, body: formData });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to generate course content.");
    },
    onFinish: (object) => {
      console.log(object);
      setIsFinished(true);
    },
  });
  const router = useRouter();

  const handleTogglePublic = async () => {
    setIsPublicState(!isPublicState);
    const response = await togglePublic(userId, courseId, !isPublicState);
    if (response.error) {
      toast.error("Failed to toggle public.");
    } else {
      toast.success("Public toggled successfully!");
    }
  };

  const handleDeleteCourse = async () => {
    setIsLoadingDelete(true);
    const res = await deleteCourse(courseId);
    if (res.error) {
      toast.error("Failed to delete course.");
    } else {
      toast.success("Course deleted successfully!");
      router.push("/app");
    }
    setIsLoadingDelete(false);
  };

  return (
    <>
      <div className="space-y-4 w-full">
        {courseChapters?.map((cpt, index) => {
          const chapter = courseGeneration?.[index];
          return (
            <Card key={cpt.id} className="w-full">
              <CardContent className="flex items-center gap-4">
                <div className="size-12 rounded-full flex items-center justify-center bg-primary">
                  <span className="text-lg font-semibold text-primary-foreground">
                    {cpt.chapterNumber}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-semibold">{cpt.title}</h1>
                  <p className="text-sm mb-1">{cpt.description}</p>
                  <div className="flex items-center gap-2 text-secondary-foreground text-sm">
                    <Clock className="size-4" />
                    <p>{cpt.time} minutes</p>
                  </div>
                </div>
                <div>
                  <div className="size-12 rounded-full bg-accent text-accent-foreground/60 flex items-center justify-center">
                    <LoadingSwap
                      isLoading={
                        isLoading &&
                        (!chapter?.content || !chapter?.contentReview)
                          ? true
                          : false
                      }
                    >
                      {(cpt.content && cpt.contentReview) ||
                      (chapter?.content && chapter.contentReview) ? (
                        <Check className="size-8" />
                      ) : (
                        <Clock className="size-8" />
                      )}
                    </LoadingSwap>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {isFinished || hasGeneratedCourseContent ? (
        <Card className="w-full">
          <CardContent className="space-y-2">
            {isPublicState && (
              <div className="flex items-center gap-2">
                <label>Course URL:</label>
                <Input
                  className="text-muted-foreground flex-1"
                  value={`${env.NEXT_PUBLIC_BASE_URL}/course/${courseId}`}
                  readOnly
                />
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${env.NEXT_PUBLIC_BASE_URL}/course/${courseId}`
                    );
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <ClipboardCheckIcon className="text-muted-foreground" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Switch
                checked={isPublicState}
                onCheckedChange={handleTogglePublic}
                className="cursor-pointer"
              />
              <Badge>{isPublicState ? "Public" : "Private"}</Badge>
            </div>
            <hr />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-destructive">
                Danger Zone
              </h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <TrashIcon />
                    Delete Course
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the course. Note that this will NOT increase your limits.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoadingDelete}>
                      <LoadingSwap isLoading={isLoadingDelete}>
                        Cancel
                      </LoadingSwap>
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isLoadingDelete}
                      onClick={async (e) => {
                        e.preventDefault();
                        await handleDeleteCourse();
                      }}
                    >
                      <LoadingSwap isLoading={isLoadingDelete}>
                        Continue
                      </LoadingSwap>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          disabled={hasGeneratedCourseContent || isLoading}
          onClick={() => generateCourseContent(null)}
          className="self-start"
        >
          {hasGeneratedCourseContent ? (
            "Start Course"
          ) : (
            <LoadingSwap isLoading={isLoading}>
              Generate Course Content
            </LoadingSwap>
          )}
        </Button>
      )}
    </>
  );
};
