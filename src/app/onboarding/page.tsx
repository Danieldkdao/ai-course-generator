import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { redirect } from "next/navigation";
import { OnboardingContent } from "./_client";

const OnboardingPage = async () => {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null) return redirect("/");
  if (user != null) return redirect("/app");

  return (
    <div className="container flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl">Creating your account...</h1>
      <OnboardingContent userId={userId} />
    </div>
  );
};

export default OnboardingPage;
