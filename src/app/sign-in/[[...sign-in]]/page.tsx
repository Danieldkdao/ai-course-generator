"use client"

import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";

const SignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignIn),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2Icon className="size-24 animate-spin" />
      </div>
    ),
  }
);

export default function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
