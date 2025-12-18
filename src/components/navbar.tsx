import { WorkflowIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="w-full flex justify-center border-b-2 border-accent py-4">
      <div className="container flex items-center justify-between">
        <WorkflowIcon className="size-10 text-primary" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};
