"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CourseTable } from "@/drizzle/schema";
import { Badge } from "@/components/ui/badge";
import {
  PenSquareIcon,
  ImageUpIcon,
  CircleXIcon,
  Loader2Icon,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveCourseImage, updateCourseInfo } from "@/features/courses/actions";
import { env } from "@/data/env/client";
import type { UploadApiResponse } from "cloudinary";
import { cn } from "@/lib/utils";
import Image from "next/image";

const updateCourseInfoSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

type UpdateCourseInfoType = z.infer<typeof updateCourseInfoSchema>;

export const Main = ({
  courseInfo,
}: {
  courseInfo: typeof CourseTable.$inferSelect;
}) => {
  const [open, setOpen] = useState(false);
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<UpdateCourseInfoType>({
    resolver: zodResolver(updateCourseInfoSchema),
    defaultValues: {
      title: courseInfo.title,
      description: courseInfo.description,
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (courseImage == null) return;
    uploadCourseImage();
  }, [courseImage]);

  const saveCourseInfoChanges = async (formData: UpdateCourseInfoType) => {
    const { title, description } = formData;
    if (
      title.trim() === courseInfo.title &&
      description.trim() === courseInfo.description
    ) {
      return toast.error("No changes have been made.");
    }
    const res = await updateCourseInfo(courseInfo.id, title, description);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      router.refresh();
      setOpen(false);
    }
  };

  const uploadCourseImage = async () => {
    setIsSaving(true);
    try {
      const signatureResponse = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/cloudinary-signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            folder: "ai-course-generation",
          }),
        }
      );
      if (!signatureResponse.ok) {
        throw new Error("Failed to get upload signature.");
      }

      const { signature, timestamp, cloudName, apiKey } =
        await signatureResponse.json();

      const formData = new FormData();
      formData.append("file", courseImage as Blob);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString()),
        formData.append("api_key", apiKey);
      formData.append("folder", "ai-course-generation");

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const cloudinaryResponse = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        toast.error(errorData.error.message);
        throw new Error(errorData.error.message);
      }

      const cloudinaryData: UploadApiResponse = await cloudinaryResponse.json();
      const url = cloudinaryData.secure_url;
      const publicId = cloudinaryData.public_id;

      const response = await saveCourseImage(
        courseInfo.id,
        { url, publicId },
        courseInfo.image?.publicId ?? null
      );
      if (response.error) {
        toast.error(response.message);
        throw new Error(response.message);
      }
      toast.success("Image uploaded successfully!");
      router.refresh();
    } catch (error) {
      console.error("Failed to save: ", error);
      toast.error("Failed to upload image");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteImage = async () => {
    setIsSaving(true);
    setCourseImage(null);
    try {
      const response = await saveCourseImage(
        courseInfo.id,
        null,
        courseInfo?.image?.publicId ?? ""
      );
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      <CardHeader className="flex-1">
        <div className="flex items-start">
          <CardTitle className="text-3xl font-bold">
            {courseInfo.title}
          </CardTitle>
          {!courseInfo.contentGenerated && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <PenSquareIcon className="size-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Course Info</DialogTitle>
                  <DialogDescription>
                    Make changes to the course here. Once you're done, save the
                    changes.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(saveCourseInfoChanges)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <Input {...field} />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                              {...field}
                              className="resize-none max-h-20"
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          disabled={form.formState.isSubmitting}
                        >
                          <LoadingSwap isLoading={form.formState.isSubmitting}>
                            Cancel
                          </LoadingSwap>
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                      >
                        <LoadingSwap isLoading={form.formState.isSubmitting}>
                          Save Changes
                        </LoadingSwap>
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>{courseInfo.description}</CardDescription>
        <Badge className="capitalize">
          {courseInfo.category === "ai" ? "AI" : courseInfo.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1">
        <label htmlFor="course-image" className="cursor-pointer">
          {courseInfo?.image?.url ? (
            <div className="relative w-full h-full max-lg:h-48 rounded-lg overflow-hidden group">
              <Button
                variant="ghost"
                onClick={deleteImage}
                className="group-hover:opacity-100 opacity-0 absolute right-2 top-2 size-10 rounded-full z-100"
              >
                <CircleXIcon className="text-destructive size-6" />
              </Button>
              {isSaving && (
                <div className="absolute z-10000 inset-0 flex items-center justify-center">
                  <Loader2Icon className="size-8 text-primary-foreground animate-spin" />
                </div>
              )}
              <Image
                src={courseInfo.image.url}
                alt="Image url"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div
              className={cn(
                "w-full h-full max-lg:h-48 bg-primary/70 rounded-lg flex items-center justify-center border-4 border-dashed",
                !isSaving && "hover:border-primary transition"
              )}
            >
              <LoadingSwap
                isLoading={isSaving}
                className="text-primary-foreground"
              >
                <ImageUpIcon className="text-primary-foreground size-24" />
              </LoadingSwap>
            </div>
          )}
        </label>
        <input
          type="file"
          disabled={isSaving}
          id="course-image"
          accept="image/*"
          className="hidden"
          onChange={(e) => setCourseImage(e.target.files?.[0] ?? null)}
        />
      </CardContent>
    </Card>
  );
};
