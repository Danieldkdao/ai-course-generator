"use client";

import { cn } from "@/lib/utils";
import {
  HomeIcon,
  ShieldCheckIcon,
  SquareStackIcon,
  WorkflowIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Progress } from "./ui/progress";

const sidebarLinks = [
  { text: "Home", href: "/app", Icon: HomeIcon },
  { text: "Explore", href: "/app/explore", Icon: SquareStackIcon },
  { text: "Upgrade", href: "/app/upgrade", Icon: ShieldCheckIcon },
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="h-full flex flex-col gap-2 border-r-2 border-accent py-2 px-3">
      <div className="flex items-center gap-2 p-2 border-b-2 border-accent pb-4">
        <WorkflowIcon className="size-10 text-primary" />
        <span className="text-2xl font-bold">AlphaWave</span>
      </div>
      <div className="flex flex-col">
        {sidebarLinks.map(({ href, text, Icon }, index) => {
          const isLink = pathname === href;
          return (
            <Link href={href} key={index}>
              <div
                className={cn(
                  "px-4 py-3 flex items-center gap-4 rounded-md",
                  isLink ? "bg-accent" : "hover:bg-accent/60"
                )}
              >
                <Icon />
                <span>{text}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="space-y-2 mt-auto pb-4">
        <Progress value={60} />
        <h3 className="text-sm font-semibold">5 of 5 courses created</h3>
        <p className="text-muted-foreground text-xs">
          Upgrade to get unlimited course generations
        </p>
      </div>
    </div>
  );
};
