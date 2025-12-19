"use client";

import dynamic from "next/dynamic";

const ClerkPricingTable = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.PricingTable),
  { ssr: false }
);

export const PricingTable = () => {
  return <ClerkPricingTable newSubscriptionRedirectUrl="/app" />;
};
