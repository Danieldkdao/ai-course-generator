"use client";

import { SparklesIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import dynamic from "next/dynamic";
import Link from "next/link";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
  }
);

export const Navbar = () => {
  return (
    <div className="w-full flex justify-center border-b-2 border-accent py-4">
      <div className="container flex items-center justify-between">
        <Link href="/app">
          <SparklesIcon className="size-10 text-primary" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};
