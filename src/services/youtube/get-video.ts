import { env } from "@/data/env/server";

export const getChapterVideo = async (query: string) => {
  const searchQuery = `${query} tutorial`;

  const params = new URLSearchParams({
    part: "snippet",
    q: searchQuery,
    type: "video",
    maxResults: "1",
    order: "relevance",
    videoDefinition: "high",
    key: env.YOUTUBE_API_KEY,
  });

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "YouTube API error");
    }
    const data = await response.json();
    if (!data.items?.[0]) {
      return null;
    }
    const video = data.items[0];
    return `https://www.youtube.com/embed/${video.id.videoId}`;
  } catch (error) {
    console.error("YouTube API error:", error);
    return null;
  }
};
