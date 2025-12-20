"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { CourseChapter } from "@/drizzle/schema";
import type { DeepPartial } from "ai";
import { PenSquareIcon, Clock, Check } from "lucide-react";
import z from "zod";
import { courseChapterSchema } from "@/services/ai/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateChapter } from "@/features/courses/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const updateChapterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

type UpdateChapterType = z.infer<typeof updateChapterSchema>;

export const Chapter = ({
  courseId,
  contentGenerated,
  cpt,
  chapter,
  isLoading,
}: {
  courseId: string;
  contentGenerated: boolean;
  cpt: CourseChapter;
  chapter: DeepPartial<z.infer<typeof courseChapterSchema>> | undefined;
  isLoading: boolean;
}) => {
  const form = useForm<UpdateChapterType>({
    resolver: zodResolver(updateChapterSchema),
    defaultValues: {
      title: cpt.title,
      description: cpt.description,
    },
  });
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const saveChapterChanges = async (formData: UpdateChapterType) => {
    const { title, description } = formData;
    if (title.trim() === cpt.title && description.trim() === cpt.description) {
      return toast.error("No changes have been made.");
    }
    const res = await updateChapter(
      courseId,
      cpt.chapterNumber - 1,
      title,
      description
    );
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      router.refresh();
      setOpen(false);
    }
  };

  return (
    <Card key={cpt.id} className="w-full">
      <CardContent className="flex items-center gap-4">
        <div className="size-12 rounded-full flex items-center justify-center bg-primary">
          <span className="text-lg font-semibold text-primary-foreground">
            {cpt.chapterNumber}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">{cpt.title}</h1>
            {!contentGenerated && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <PenSquareIcon className="size-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Chapter {cpt.chapterNumber}</DialogTitle>
                    <DialogDescription>
                      Make changes to chapter {cpt.chapterNumber} here. Once
                      you're done, save the changes.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(saveChapterChanges)}
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
                            <LoadingSwap
                              isLoading={form.formState.isSubmitting}
                            >
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
          <p className="text-sm mb-1">{cpt.description}</p>
          <div className="flex items-center gap-2 text-secondary-foreground text-sm">
            <Clock className="size-4" />
            <p>{cpt.time} minutes</p>
          </div>
        </div>
        <div>
          <div className="size-12 rounded-full bg-accent text-accent-foreground/60 flex items-center justify-center">
            <LoadingSwap
              isLoading={
                isLoading && (!chapter?.content || !chapter?.contentReview)
                  ? true
                  : false
              }
            >
              {(cpt.content && cpt.contentReview) ||
              (chapter?.content && chapter.contentReview) ? (
                <Check className="size-8" />
              ) : (
                <Clock className="size-8" />
              )}
            </LoadingSwap>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
