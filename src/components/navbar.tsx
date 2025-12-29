"use client";

import { SidebarOpenIcon, SparklesIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
  }
);

export const Navbar = () => {
  const { userId } = useAuth();
  const { showSidebar, setShowSidebar } = useSidebar();
  return (
    <div className="w-full flex justify-center border-b-2 border-accent py-4">
      <div className="container flex items-center justify-between">
        <Link href={!userId ? "/" : "/app"}>
          <SparklesIcon className="size-10 text-primary" />
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              if (showSidebar) return;
              setShowSidebar(true);
            }}
            className={cn(
              "py-2 px-1 rounded-lg md:hidden",
              showSidebar
                ? "opacity-0 pointer-events-none"
                : "opacity-100 pointer-events-auto"
            )}
          >
            <SidebarOpenIcon />
          </Button>
          <ThemeToggle />
          {userId ? (
            <UserButton />
          ) : (
            <Button>
              <Link href="/sign-in">Get started</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
