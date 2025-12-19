import { env } from "@/data/env/server";
import cloudinary from "@/services/cloudinary/cloudinary";
import { NextResponse } from "next/server";
import { env as envClient } from "@/data/env/client";

export const POST = async (req: Request) => {
  try {
    const { folder } = await req.json();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: folder || "ai-course-generation",
      },
      env.CLOUDINARY_API_SECRET
    );
    return NextResponse.json({
      signature,
      timestamp,
      cloudName: envClient.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to generate signature",
      },
      { status: 500 }
    );
  }
};
