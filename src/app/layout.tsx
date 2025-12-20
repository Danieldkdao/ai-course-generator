import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@/services/clerk/components/clerk-provider";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarContextProvider } from "@/hooks/use-sidebar";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Course Generator",
  description: "An AI course generator platform build by Daniel Dao.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${outfitSans.variable} ${outfitSans.className} antialiased`}
          >
            <SidebarContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableColorScheme
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </SidebarContextProvider>
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
