import { ForbiddenError } from "apollo-server-micro";
import { ObjectId } from "mongodb";
import { extendType, nonNull, objectType, stringArg } from "nexus";

import { PostObject } from "./post";
import { UserObject } from "./user";
import { connectToDatabase } from "@/lib/mongodb";
import { LikeModel, PostModel, UserModel } from "@/models";

// Object Types
export const LikeObject = objectType({
  name: "Like",
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
  },
});

// Query Types
export const GetLikesQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("getPostLikes", {
      type: LikeObject,
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (_root, { postId }, { session }) => {
        if (!session) {
          throw new ForbiddenError("Not logged in");
        }

        const { db } = await connectToDatabase();

        const likes = await db
          .collection<LikeModel>("likes")
          .find({ postId: new ObjectId(postId) })
          .toArray();
        return likes.map((like) => LikeModel.toDto(like));
      },
    });
  },
});

// Mutation Types
export const LikePostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("likePost", {
      type: LikeObject,
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (_root, { postId }, { session }) => {
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

          const like = LikeModel.createDocument({
            postId: new ObjectId(postId),
            userId: new ObjectId(userId),
          });
          await db.collection<LikeModel>("likes").insertOne(like);
          await db
            .collection<PostModel>("posts")
            .updateOne({ _id: new ObjectId(postId) }, { $inc: { likes: 1 } });

          return LikeModel.toDto(like);
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    });
  },
});

export const UnlikePostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.string("unlikePost", {
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (_root, { postId }, { session }) => {
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
            .collection<LikeModel>("likes")
            .findOneAndDelete({
              postId: new ObjectId(postId),
              userId: new ObjectId(session.user.id),
            });
          if (!result.value) {
            throw new Error("Like not found");
          }
          await db
            .collection<PostModel>("posts")
            .updateOne({ _id: new ObjectId(postId) }, { $inc: { likes: -1 } });

          return "Post unliked successfully";
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    });
  },
});
