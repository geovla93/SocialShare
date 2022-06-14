import { everything } from "@/graphql/generated/genql";
import client from "@/lib/genql";
import { Post, User } from "@/models";

export const getPosts = async (
  pageNumber: number
): Promise<{ posts: Post[]; nextId?: number }> => {
  const { posts } = await client.query({
    posts: [
      { pageNumber },
      {
        ...everything,
        user: { ...everything, createdAt: false, updatedAt: false },
      },
    ],
  });
  if (typeof posts === "undefined") {
    throw new Error("Posts not returned");
  }
  console.log("🚀 ~ file: fetcher.ts ~ line 16 ~ getPosts ~ posts", posts);

  return {
    posts: posts as Post[],
    nextId: posts.length > 0 ? pageNumber + 1 : undefined,
  };
};

export const getUsers = async (
  name: string
): Promise<Pick<User, "id" | "image" | "name" | "username">[] | null> => {
  if (name.length === 0) return null;
  const { users } = await client.query({
    users: [{ name }, { id: true, name: true, username: true, image: true }],
  });
  if (typeof users === "undefined") {
    throw new Error("Users not returned");
  }

  return users;
};
