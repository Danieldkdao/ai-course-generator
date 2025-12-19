"use client";

import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";

const ClerkPricingTable = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.PricingTable),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2Icon className="size-24 animate-spin" />
      </div>
    ),
  }
);

export const PricingTable = () => {
  return <ClerkPricingTable newSubscriptionRedirectUrl="/app" />;
};
