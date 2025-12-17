import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getCurrentUser = async ({ allData = false } = {}) => {
  const { userId, redirectToSignIn } = await auth();

  return {
    userId,
    redirectToSignIn,
    user: allData && userId !== null ? await getUser(userId) : undefined,
  };
};

const getUser = async (id: string) => {
  "use cache";
  // add cache tag
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
};
