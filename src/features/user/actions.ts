"use server";

import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getUser = async (id: string) => {
  "use cache";

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
};
