import { everything } from "@/graphql/generated/genql";
import client from "@/lib/genql";

export const submitPost = async ({
  data,
  picUrl,
}: {
  data: { text: string; location?: string };
  picUrl?: string;
}) => {
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

    return post;
  } catch (error) {
    console.error(error);
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
  likeId,
  postId,
  isLiked,
}: {
  likeId: string;
  postId: string;
  isLiked: boolean;
}) => {
  try {
    if (isLiked) {
      await client.mutation({ unlikePost: [{ likeId, postId }] });
    } else {
      await client.mutation({ likePost: [{ postId }, {}] });
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
