import { everything } from "@/graphql/generated/genql";
import client from "@/lib/genql";
import { Comment, Like, Post } from "@/models";

export const getPostLikes = async (postId: string): Promise<Like[]> => {
  const { getPostLikes: likes } = await client.query({
    getPostLikes: [
      { postId },
      {
        ...everything,
        createdAt: false,
        updatedAt: false,
      },
    ],
  });
  if (typeof likes === "undefined") {
    throw new Error("No likes found");
  }

  return likes;
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const { getPostComments: comments } = await client.query({
    getPostComments: [
      { postId },
      {
        ...everything,
        createdAt: false,
        updatedAt: false,
        user: {
          ...everything,
          createdAt: false,
          updatedAt: false,
        },
      },
    ],
  });
  if (typeof comments === "undefined") {
    throw new Error("No comments found");
  }

  return comments as Comment[];
};

export const submitPost = async ({
  data,
  picUrl,
}: {
  data: { text: string; location?: string };
  picUrl?: string;
}): Promise<Post> => {
  try {
    const post = await client.mutation({
      submitPost: [
        { text: data.text, location: data.location, image: picUrl },
        {
          ...everything,
          userId: false,
          user: { ...everything, createdAt: false, updatedAt: false },
        },
      ],
    });
    if (typeof post === "undefined") {
      throw new Error("Post not returned");
    }

    return post as Post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePost = async ({ postId }: { postId: string }) => {
  try {
    await client.mutation({ deletePost: [{ postId }] });
  } catch (error) {
    console.error(error);
  }
};

export const likePost = async ({
  postId,
  isLiked,
}: {
  postId: string;
  isLiked: boolean;
}) => {
  try {
    if (isLiked) {
      await client.mutation({ unlikePost: [{ postId }] });
    } else {
      await client.mutation({ likePost: [{ postId }, { id: true }] });
    }
  } catch (error) {
    console.error(error);
  }
};

export const submitComment = async ({
  postId,
  text,
}: {
  postId: string;
  text: string;
}) => {
  try {
    await client.mutation({ submitComment: [{ postId, text }] });
  } catch (error) {
    console.error(error);
  }
};

export const deleteComment = async ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  try {
    await client.mutation({ deleteComment: [{ postId, commentId }] });
  } catch (error) {
    console.error(error);
  }
};
