import { env } from "@/data/env/server";
import { env as envClient } from "@/data/env/client";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: envClient.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
