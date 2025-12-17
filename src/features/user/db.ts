import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const upsertUser = async (user: typeof UserTable.$inferInsert) => {
  await db
    .insert(UserTable)
    .values(user)
    .onConflictDoUpdate({
      target: [UserTable.id],
      set: user,
    });

    // todo: revalidate cache
};

export const deleteUser = async (id: string) => {
  await db.delete(UserTable).where(eq(UserTable.id, id));

  // todo: revalidate cache
};
