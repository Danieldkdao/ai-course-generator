"use client";

import { getUser } from "@/features/users/actions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const OnboardingContent = ({ userId }: { userId: string }) => {
  const router = useRouter();
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const user = await getUser(userId);
      if (user == null) return;

      router.replace("/dashboard");
      clearInterval(intervalId);
    });
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <Loader2Icon className="size-24 animate-spin" />;
};
