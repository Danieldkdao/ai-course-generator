import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export const errorToast = (message: string, type: "upgrade" | "error") => {
  if (type === "upgrade") {
    const toastId = toast.error(message, {
      action: (
        <Button
          size="sm"
          asChild
          onClick={() => {
            toast.dismiss(toastId);
          }}
        >
          <Link href="/app/upgrade">Upgrade</Link>
        </Button>
      ),
    });
    return;
  }
  return toast.error(message);
};
