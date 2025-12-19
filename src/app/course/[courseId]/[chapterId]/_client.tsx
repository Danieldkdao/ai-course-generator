"use client";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ReviewQuestions } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { use, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

type Result = "c" | "i" | "nd";

export const ContentReview = ({
  contentReview,
}: {
  contentReview: ReviewQuestions[];
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array.from({ length: contentReview.length }, (_) => "")
  );
  const [results, setResults] = useState<Result[]>(
    contentReview.map((_) => "nd")
  );

  const checkAnswers = () => {
    if (selectedAnswers.find((item) => item === "") === "")
      return toast.error("Please select an option");
    setResults((prev) =>
      prev.map((res, index) => {
        return contentReview[index].answer === selectedAnswers[index]
          ? "c"
          : "i";
      })
    );
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {contentReview.map((cr, index) => (
            <ContentReviewQuestion
              key={String(index) + cr.question}
              contentReview={cr}
              index={index}
              selectedAnswers={selectedAnswers}
              setSelectedAnswers={setSelectedAnswers}
              result={results[index]}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkAnswers} variant="secondary" className="w-full">
          Check Answers
        </Button>
      </CardFooter>
    </Card>
  );
};

const ContentReviewQuestion = ({
  contentReview,
  index,
  selectedAnswers,
  setSelectedAnswers,
  result,
}: {
  contentReview: ReviewQuestions;
  index: number;
  selectedAnswers: string[];
  setSelectedAnswers: Dispatch<SetStateAction<string[]>>;
  result: Result;
}) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border space-y-4",
        result === "c"
          ? "bg-success/20"
          : result === "i"
          ? "bg-destructive/20"
          : ""
      )}
    >
      <div className="text-lg font-medium">
        <MarkdownRenderer content={contentReview.question} />
      </div>
      <div className="flex flex-col gap-1">
        {contentReview.options.map((option, idx) => (
          <Button
            onClick={() =>
              setSelectedAnswers((prev) =>
                prev.map((o, i) => {
                  if (i === index) return option;
                  return o;
                })
              )
            }
            key={idx}
            variant={selectedAnswers[index] === option ? "default" : "outline"}
            className="flex justify-start"
          >
            <MarkdownRenderer content={option} />
          </Button>
        ))}
      </div>
    </div>
  );
};
