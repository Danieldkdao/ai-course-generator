"use client"

import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export const ClerkProvider = ({ children }: { children: ReactNode }) => {
  return <OriginalClerkProvider>{children}</OriginalClerkProvider>;
};
