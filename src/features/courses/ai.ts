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
      - time: integer number of minutes to complete the course,
      - query: string (a short but effective search query to search the YouTube API for videos that best fit the content of the course)
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
  if (!courseInfo.courseChapters) return null;
  return streamObject({
    model: google("gemini-3-flash-preview"),
    prompt: `Generate FULL, DETAILED chapter content for the following course.

    You MUST produce a single array where:
    - Each array element corresponds to EXACTLY ONE chapter
    - The array length MUST equal the total number of chapters listed below
    - Chapters MUST appear in the SAME ORDER as provided
    - NO chapters may be skipped, merged, shortened, or omitted
    - ALL chapter content must be fully generated before stopping
    - You must output valid JSON only. Do not include any conversational text, markdown formatting, or preamble like 'Here is the output'. Do not use control characters within strings. Escaping newlines is required.
    
    ──────────────── COURSE METADATA ────────────────
    Title: ${courseInfo.title}
    Topic: ${courseInfo.topic}
    Category: ${courseInfo.category}
    Difficulty level: ${courseInfo.difficultyLevel}
    Target duration: ${courseInfo.duration}
    Additional goals/details: ${courseInfo.details ?? "none provided"}
    
    ──────────────── CHAPTERS (STRICT ORDER) ────────────────
    ${courseInfo.courseChapters
      .map(
        (ch) =>
          `#${ch.chapterNumber}: ${ch.title}
    Description: ${ch.description}
    Expected minutes: ${ch.time ?? "n/a"}`
      )
      .join("\n\n")}
    
    ──────────────── REQUIRED OUTPUT FORMAT ────────────────
    Return ONE JSON ARRAY. Each array element represents ONE chapter and MUST follow this schema exactly:
    
    {
      "content": string,
      "contentReview": [
        {
          "question": string,
          "options": [string, string, string, string],
          "answer": string
        }
      ]
    }
    
    ──────────────── CONTENT REQUIREMENTS ────────────────
    For EACH chapter object:
    
    1. content (string):
       - Must be LONG-FORM, thorough, and instructional (not a summary)
       - Written in rich Markdown
       - Must begin with an H1 (#) using the EXACT chapter title
       - Include:
         - A short introductory overview
         - Clearly structured sections using H2/H3 headings
         - Explanations, examples, and practical context
         - Bullets, numbered steps, or tables where useful
         - Chapter-specific depth appropriate to the difficulty level
         - A concise recap or key takeaways section at the end
       - Math formatting:
         - Wrap all math expressions in $$ … $$
         - Write all LaTeX commands using double backslashes
           (e.g., \\alpha, \\sum_{i=1}^{n}, \\frac{a}{b})
    
    2. contentReview (array):
       - Must contain 1–3 questions
       - Each question MUST:
         - Be specific to the chapter content
         - Have exactly 4 distinct options
         - Include one correct answer
         - Set "answer" to EXACTLY match one of the options (character-for-character)
    
    ──────────────── STRICT RULES ────────────────
    - The number of JSON objects MUST equal the number of chapters listed.
    - Do NOT combine chapters.
    - Do NOT introduce new chapters.
    - Do NOT omit any chapter.
    - Do NOT include placeholders, TODOs, or references to “later sections.”
    - Do NOT stop early — generate ALL chapters completely.
    - Output JSON ONLY (no code fences, no markdown outside strings, no commentary).
    `,
    system: `You are a senior instructional designer and subject-matter expert.

    Your task is to generate COMPLETE, EXHAUSTIVE, and ACCURATE instructional content for a multi-chapter course. You must strictly follow the provided course metadata and chapter list.
    
    ════════════════════ CORE RESPONSIBILITIES ════════════════════
    - Produce ONE JSON ARRAY and NOTHING ELSE.
    - Each array element MUST represent exactly ONE chapter.
    - The array length MUST MATCH the number of chapters provided.
    - Chapters MUST appear in the exact order given.
    - You MUST generate ALL chapters fully before stopping.
    
    ════════════════════ CHAPTER OBJECT SCHEMA ════════════════════
    Each chapter object MUST contain:
    
    1. content (string)
       - Long-form Markdown that thoroughly teaches the chapter
       - Begin with an H1 (#) using the exact chapter title
       - Include:
         - Clear introduction
         - Logically structured H2/H3 sections
         - Concrete explanations, examples, and applications
         - Lists, steps, and diagrams (described textually) where helpful
         - Pitfalls, best practices, or insights where relevant
         - A short recap or takeaway section at the end
       - Math rules:
         - All math wrapped in $$ … $$
         - All LaTeX commands written with double backslashes only
    
    2. contentReview (array of 1–3 objects)
       - Each object must include:
         - question: clear, chapter-specific comprehension check
         - options: exactly 4 distinct strings
         - answer: a string that EXACTLY matches one of the options
    
    ════════════════════ GLOBAL CONSTRAINTS ════════════════════
    - Maintain alignment with course topic, category, difficulty, and duration.
    - Calibrate depth appropriately (no shallow summaries).
    - Avoid filler, repetition, or generic phrasing.
    - Do NOT add commentary, explanations, or formatting outside the JSON.
    - Do NOT use code fences.
    - Do NOT stop generation until ALL chapters are completed.
    
    Failure to meet ANY of these constraints is an incorrect response.
    `,
    schema: courseContentSchema,
  });
};
