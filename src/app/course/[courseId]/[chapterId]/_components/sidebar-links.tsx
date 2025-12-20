"use client";

import type { CourseChapter } from "@/drizzle/schema";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export const SidebarLinks = ({
  courseId,
  courseTitle,
  courseChapters,
  chapterId,
}: {
  courseId: string;
  courseTitle: string;
  courseChapters: CourseChapter[] | null;
  chapterId: string;
}) => {
  const { showSidebar, setShowSidebar } = useSidebar();
  const sidebarRef = useRef(null);
  if (courseChapters == null) return null;

  useClickOutside(sidebarRef, () => setShowSidebar(false));

  return (
    <div
      className={cn(
        "w-72 max-md:fixed h-full bg-background overflow-y-auto border-r-2 md:translate-x-0 transition",
        showSidebar ? "translate-x-0" : "-translate-x-full"
      )}
      ref={sidebarRef}
    >
      <h1 className="text-primary-foreground text-xl font-bold p-2 bg-primary">
        {courseTitle}
      </h1>
      {courseChapters.map((chapter) => {
        const isSelected = chapterId === chapter.id;
        return (
          <Link href={`/course/${courseId}/${chapter.id}`} key={chapter.id}>
            <div
              className={cn(
                "flex items-center gap-4 p-2 border-b-2",
                isSelected ? "bg-primary/20" : "hover:bg-primary/5 transition"
              )}
            >
              <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                <h1 className="text-xl font-bold text-primary-foreground">
                  {chapter.chapterNumber}
                </h1>
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{chapter.title}</h1>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary size-4" />
                  <p className="text-primary">{chapter.time} minutes</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
