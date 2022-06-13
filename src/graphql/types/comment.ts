import { ForbiddenError } from "apollo-server-micro";
import { ObjectId } from "mongodb";
import { extendType, nonNull, objectType, stringArg } from "nexus";

import { PostObject } from "./post";
import { UserObject } from "./user";
import { connectToDatabase } from "@/lib/mongodb";
import { CommentModel, PostModel, UserModel } from "@/models";

// Object Types
export const CommentObject = objectType({
  name: "Comment",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.date("createdAt");
    t.nonNull.date("updatedAt");
    t.nonNull.string("userId");
    t.nonNull.string("postId");
    t.field("user", {
      type: UserObject,
      resolve: async (root) => {
        const { db } = await connectToDatabase();
        const user = await db
          .collection<UserModel>("users")
          .findOne({ _id: new ObjectId(root.userId) });
        if (!user) return null;

        return UserModel.toDto(user);
      },
    });
    t.field("post", {
      type: PostObject,
      resolve: async (root) => {
        const { db } = await connectToDatabase();
        const post = await db
          .collection<PostModel>("posts")
          .findOne({ _id: new ObjectId(root.postId) });
        if (!post) return null;

        return PostModel.toDto(post);
      },
    });
    t.nonNull.string("text");
  },
});

// Mutation Types
export const SubmitCommentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.string("submitComment", {
      args: {
        postId: nonNull(stringArg()),
        text: nonNull(stringArg()),
      },
      resolve: async (_root, { postId, text }, { session }) => {
        try {
          if (!session) throw new ForbiddenError("Unauthorized");
          const userId = session.user.id;

          const { db } = await connectToDatabase();

          const post = await db
            .collection<PostModel>("posts")
            .findOne({ _id: new ObjectId(postId) });
          if (!post) {
            throw new Error("Post not found");
          }

          const comment = new CommentModel({
            text,
            userId: new ObjectId(userId),
            postId: new ObjectId(postId),
          });
          await db.collection<CommentModel>("comments").insertOne(comment);

          return "Comment was successfully created";
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    });
  },
});

export const DeleteCommentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.string("deleteComment", {
      args: {
        postId: nonNull(stringArg()),
        commentId: nonNull(stringArg()),
      },
      resolve: async (_root, { postId, commentId }, { session }) => {
        try {
          if (!session) throw new ForbiddenError("Unauthorized");

          const { db } = await connectToDatabase();

          const post = await db
            .collection<PostModel>("posts")
            .findOne({ _id: new ObjectId(postId) });
          if (!post) {
            throw new Error("Post not found");
          }

          const result = await db
            .collection<CommentModel>("comments")
            .findOneAndDelete({ _id: new ObjectId(commentId) });
          if (!result.value) {
            throw new Error("Comment not found");
          }

          return "Comment deleted successfully";
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    });
  },
});
