import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { PlusIcon } from "lucide-react";

const AppPage = async () => {
  const { userId, redirectToSignIn, user } = await getCurrentUser({
    allData: true,
  });
  if (userId == null || !user) return redirectToSignIn();
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl">
            Hello, <span className="font-extrabold">{user.name}</span>
          </h1>
          <p className="./">
            Create a new course with AI, share it with your friends, and earn
            rewards.
          </p>
        </div>
        <Button className="flex items-center gap-2 cursor-pointer">
          <PlusIcon />
          <span>Create New Course</span>
        </Button>
      </div>
    </div>
  );
};

export default AppPage;
