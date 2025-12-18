import { z } from "zod";

export const courseLayoutSchema = z.object({
  title: z.string().describe("A short and descriptive title of the course."),
  description: z
    .string()
    .describe(
      "A summarized description of the course, the topics, and what users will learn."
    ),
  courseChapters: z.array(
    z.object({
      chapterNumber: z.number().min(1).describe("The chapter number."),
      title: z.string().describe("The course title."),
      description: z
        .string()
        .describe(
          "A quick, one sentence summary of what users will learn in the chapter."
        ),
      time: z
        .number()
        .min(1)
        .describe("The amount of time to complete the chapter in minutes."),
    })
  ),
});

export const courseContentSchema = z.array(
  z.object({
    content: z
      .string()
      .describe(
        "The main content of the chapter, should be very long, descriptive, detailed, insightful, and original."
      ),
    contentReview: z
      .array(
        z.object({
          question: z.string().describe("The question."),
          options: z
            .array(z.string())
            .length(4)
            .describe("An array of 4 string, answer choices."),
          answer: z
            .string()
            .describe(
              "The answer to the question, must match one of the options."
            ),
        })
      )
      .min(1)
      .max(3)
      .describe(
        "An array of 1-3 questions, quizing the user on the content of the chapter."
      ),
  })
);
