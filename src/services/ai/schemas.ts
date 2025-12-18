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
