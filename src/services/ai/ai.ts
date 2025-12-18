import { env } from "@/data/env/server";
import type { CreateNewFormData } from "@/features/courses/components/create-new";
import { generateObject } from "ai";
import { openrouter } from "./models/openrouter";
import { courseLayoutSchema } from "./schemas";

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
