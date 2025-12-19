import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import { Suspense, type ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <SuspendedAppLayout>{children}</SuspendedAppLayout>
    </Suspense>
  );
};

export default AppLayout;

const SuspendedAppLayout = async ({ children }: { children: ReactNode }) => {
  const { redirectToSignIn, user } = await getCurrentUser({ allData: true });
  if (!user) return redirectToSignIn();

  const isPro = (await auth()).has({ plan: "pro" });

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <Sidebar coursesCreated={user.coursesCreated} isPro={isPro} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
