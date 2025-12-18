"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  courseCategories,
  courseDurations,
  difficultyLevels,
} from "@/drizzle/schema";
import {
  Atom,
  Calculator,
  Code2,
  Cpu,
  Flame,
  Gauge,
  Hourglass,
  Palette,
  PlusIcon,
  Smile,
  Timer,
  Video,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNewCourseLayout } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingSwap } from "@/components/ui/loading-swap";

const categories = [
  { text: "Math", value: "math", Icon: Calculator },
  { text: "Science", value: "science", Icon: Atom },
  { text: "Programming", value: "programming", Icon: Code2 },
  { text: "Creative", value: "creative", Icon: Palette },
  { text: "AI", value: "ai", Icon: Cpu },
  { text: "Human", value: "human", Icon: Users },
];

const difficulties = [
  { text: "Easy", value: "easy", Icon: Smile },
  { text: "Medium", value: "medium", Icon: Gauge },
  { text: "Hard", value: "hard", Icon: Flame },
];

const durations = [
  { text: "1 hour", value: "1 hour", Icon: Timer },
  { text: "2 hours", value: "2 hours", Icon: Hourglass },
  { text: "3+ hours", value: "3+ hours", Icon: Gauge },
];

const includeVideosOptions = [
  { text: "Include Videos", value: "true", Icon: Video },
  { text: "No Videos", value: "false", Icon: Users },
];

const CreateNewSchema = z.object({
  topic: z.string().trim().min(1),
  details: z.string().trim().min(1),
  category: z.enum(courseCategories),
  difficultyLevel: z.enum(difficultyLevels),
  duration: z.enum(courseDurations),
  includeVideos: z.boolean(),
  numberOfChapters: z.int().min(1),
});

export type CreateNewFormData = z.infer<typeof CreateNewSchema>;

export const CreateNewCourse = ({
  trigger = (
    <Button>
      <PlusIcon />
      <span>Create New Course</span>
    </Button>
  ),
} = {}) => {
  const form = useForm<CreateNewFormData>({
    resolver: zodResolver(CreateNewSchema),
    defaultValues: {
      topic: "",
      details: "",
      numberOfChapters: 1,
      includeVideos: false,
    },
  });
  const router = useRouter();

  const handleCreateCourseLayout = async (data: CreateNewFormData) => {
    const response = await createNewCourseLayout(data);
    if (response.error && !response.id) {
      return toast.error(response.message);
    } else {
      toast.success(response.message);
      router.push(`/app/create-course/${response.id}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="">
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Create a new course to share, complete, and earn from.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateCourseLayout)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter course topic..." />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional information</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter additional information about the course..."
                      className="resize-none max-h-20"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfChapters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Chapters</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="Enter number of course chapters"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || null)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(e) => field.onChange(e)}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories.map(({ value, text, Icon }) => (
                              <SelectItem
                                value={value}
                                key={value}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Icon />
                                <span>{text}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(e) => field.onChange(e)}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select a difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Difficulties</SelectLabel>
                            {difficulties.map(({ value, text, Icon }) => (
                              <SelectItem
                                value={value}
                                key={value}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Icon />
                                <span>{text}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(e) => field.onChange(e)}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select a duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Durations</SelectLabel>
                            {durations.map(({ value, text, Icon }) => (
                              <SelectItem
                                value={value}
                                key={value}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Icon />
                                <span>{text}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeVideos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Include Videos</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(e) => field.onChange(e === "true")}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Options</SelectLabel>
                            {includeVideosOptions.map(
                              ({ value, text, Icon }) => (
                                <SelectItem
                                  value={value}
                                  key={value}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Icon />
                                  <span>{text}</span>
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button className="w-full" disabled={form.formState.isSubmitting}>
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Create Layout
                </LoadingSwap>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
