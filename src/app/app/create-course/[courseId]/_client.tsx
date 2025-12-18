"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import type { CourseChapter } from "@/drizzle/schema";
import { courseContentSchema } from "@/services/ai/schemas";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Check, Clock } from "lucide-react";
import { toast } from "sonner";

export const CourseInfoClient = ({
  courseId,
  courseChapters,
}: {
  courseId: string;
  courseChapters: CourseChapter[] | null;
}) => {
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
  });

  const courseContentGen = courseChapters?.map((item) =>
    item.content && item.contentReview ? true : false
  );
  const hasGeneratedCourseContent = courseContentGen
    ? courseContentGen.find((item) => item === false)
      ? false
      : true
    : false;

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
                      {cpt.content && cpt.contentReview ? (
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
    </>
  );
};
