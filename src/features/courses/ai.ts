import { env } from "@/data/env/server";
import type { CreateNewFormData } from "@/features/courses/components/create-new";
import { generateObject, streamObject } from "ai";
import { openrouter } from "../../services/ai/models/openrouter";
import {
  courseContentSchema,
  courseLayoutSchema,
} from "../../services/ai/schemas";
import type { CourseTable } from "@/drizzle/schema";
import { google } from "@/services/ai/models/google";

export const aiGenerateCourseLayout = async (data: CreateNewFormData) => {
  try {
    const { object: courseLayout } = await generateObject({
      model: openrouter.chat(env.OPEN_ROUTER_MODEL),
      prompt: `Create a course layout with the following inputs:
    - Topic: ${data.topic}
    - Category: ${data.category}
    - Difficulty: ${data.difficultyLevel} (align rigor accordingly)
    - Target duration: ${data.duration}
    - Include videos: ${data.includeVideos ? "yes" : "no"}
    - Additional details / goals: ${data.details}
    - Number of chapters: ${data.numberOfChapters}
    
    Return only a JSON object matching the schema (title, description, courseChapters with sequential chapterNumber/title/description).
    `,
      system: `You are an expert curriculum designer and instructional writer. Build concise, marketable course outlines that balance clarity and rigor. You must return a JSON object that EXACTLY matches this schema:
    - title: string (engaging, benefit-led; ≤80 chars)
    - description: string (2–3 sentences; who it’s for, what they’ll be able to do, and distinguishing angle)
    - courseChapters: array of objects length == numberOfChapters provided by the user. Each object:
      - chapterNumber: integer starting at 1, strictly sequential
      - title: string (actionable, outcome-focused)
      - description: string (1–2 sentences on what is learned/done)
      - time: integer number of minutes to complete the course
    Rules:
    - Obey the user’s topic, category, difficultyLevel, duration, includeVideos preference, and details (these are authoritative).
    - Calibrate scope and rigor to difficultyLevel.
    - Ensure that the time per chapter adds up to roughly fit the specified course duration
    - Balance theory and practice; include variety across chapters (foundations → skills → application → wrap-up/assessment).
    - If includeVideos is true, write descriptions that anticipate video-led learning; if false, emphasize readings/exercises.
    - Fit the total number of chapters; do not add extra fields or text outside the JSON.
    - Keep content original, specific, and free of placeholders.
    Respond with JSON only—no prose or code fences.`,
      schema: courseLayoutSchema,
    });
    return courseLayout;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const aiGenerateCourseContent = async (
  courseInfo: typeof CourseTable.$inferSelect
) => {
  if(!courseInfo.courseChapters) return null;
  return streamObject({
    model: google("gemini-2.5-flash"),
    prompt: `Generate detailed chapter content for this course in JSON matching the schema (content, video, contentReview[question, options[4], answer]):

    Course metadata:
    - Title: ${courseInfo.title}
    - Topic: ${courseInfo.topic}
    - Category: ${courseInfo.category}
    - Difficulty: ${courseInfo.difficultyLevel}
    - Target duration: ${courseInfo.duration}
    - Additional details/goals: ${courseInfo.details ?? "none provided"}
    
    Chapters to cover (use this exact order and titles):
    ${courseInfo.courseChapters
      .map(
        (ch) =>
          `- #${ch.chapterNumber}: ${ch.title} — ${
            ch.description
          } (expected minutes: ${ch.time ?? "n/a"})`
      )
      .join("\n")}
    
    Formatting requirements:
    - Return one JSON array element per chapter in this order.
    - In content, wrap any math in $$…$$ and write all LaTeX commands with double backslashes (e.g., \\alpha, \\sum_{i=1}^{n}).
    - Each element must include:
      - content: rich Markdown as instructed (not short; fully teach the material)
      - contentReview: 1–3 questions with 4 options each and a correct answer that matches an option exactly
    
    Return JSON only (no code fences, no additional commentary).
    `,
    system: `You are a senior instructional designer and subject-matter expert. Produce exhaustive, accurate, and engaging chapter content in Markdown, with tight alignment to the supplied course metadata and chapter outlines. You must return ONLY a JSON array where each element represents one chapter in order, matching the provided chapter list exactly. Each element must follow this schema:
    - content: string — long-form Markdown that teaches the chapter thoroughly. Include:
      - a clear H1 with the chapter title
      - short intro
      - well-structured sections with H2/H3 headings
      - bullets, numbered steps, and examples
      - where useful: mini case studies, code snippets (if applicable), checklists, pitfalls, and actionable takeaways
      - LaTeX: wrap any math in $$…$$, and all LaTeX commands must be written with double backslashes (e.g., \\alpha, \\frac{a}{b})
      - a brief recap at the end
      - keep everything specific to the chapter scope; no placeholders.
    - contentReview: array (length 1–3) of:
      - question: string — precise, chapter-specific check-for-understanding
      - options: string[4] — plausible distractors plus the correct answer, all distinct
      - answer: string — must exactly match one of the options
    
    Global rules:
    - Follow the provided chapter order and titles exactly; do not add or remove chapters.
    - Calibrate depth, rigor, and assumptions to the course difficulty.
    - Honor course category, topic, duration, and any details/goals provided.
    - Keep language clear, concise, and professional; avoid fluff.
    - Return JSON only; no prose, no code fences, no trailing text.
    `,
    schema: courseContentSchema,
  });
};
