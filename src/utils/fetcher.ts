import { everything } from "@/graphql/generated/genql";
import client from "@/lib/genql";
import { User } from "@/models";

export const getPosts = async (pageNumber: number) => {
  const posts = await client.query({
    posts: [
      { pageNumber },
      {
        ...everything,
        userId: false,
        user: { ...everything, createdAt: false, updatedAt: false },
        likes: { userId: true },
      },
    ],
  });
  if (!Array.isArray(posts)) {
    throw new Error("Posts not returned");
  }

  return {
    posts,
    nextId: posts.length > 0 ? pageNumber + 1 : undefined,
  };
};

export const getUsers = async (
  name: string
): Promise<Pick<User, "id" | "image" | "name" | "username">[] | null> => {
  if (name.length === 0) return null;
  const users = await client.query({
    users: [{ name }, { id: true, name: true, username: true, image: true }],
  });
  if (!Array.isArray(users)) {
    throw new Error("Users not returned");
  }

  return users;
};
