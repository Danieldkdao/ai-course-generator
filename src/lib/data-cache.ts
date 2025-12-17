type CacheTag = "users" | "courses";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}` as const;
};

export const getUserTag = (tag: CacheTag, userId: string) => {
  return `user:${userId}:${tag}`;
};

export const getIdTag = (tag: CacheTag, id: string) => {
  return `id:${id}:${tag}` as const
}
