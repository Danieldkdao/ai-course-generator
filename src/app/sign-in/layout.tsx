import { Suspense, type ReactNode } from "react";
import { Loader2Icon } from "lucide-react";
import { connection } from "next/server";

const SignInLayout = async ({ children }: { children: ReactNode }) => {
  await connection();

  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default SignInLayout;
