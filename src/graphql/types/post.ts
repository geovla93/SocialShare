import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { ForbiddenError } from "apollo-server-micro";
import { ObjectId } from "mongodb";

import { UserObject } from "./user";
import { CommentObject } from "./comment";
import { LikeObject } from "./like";
import { connectToDatabase } from "@/lib/mongodb";
import { PostModel, UserModel } from "@/models";

// Object Types
export const PostObject = objectType({
  name: "Post",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.date("createdAt");
    t.nonNull.date("updatedAt");
    t.nonNull.string("userId");
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
    t.nonNull.string("text");
    t.string("location");
    t.string("image");
    t.int("likesCount");
    t.int("commentsCount");
  },
});

// Query Types
export const GetPostsQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("posts", {
      type: PostObject,
      args: {
        pageNumber: nonNull(intArg()),
      },
    });
  },
});

// Mutation Types
export const SubmitPostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("submitPost", {
      type: PostObject,
      args: {
        text: nonNull(stringArg()),
        location: stringArg(),
        image: stringArg(),
      },
      resolve: async (_root, { text, location, image }, { session }) => {
        try {
          if (!session) throw new ForbiddenError("Unauthorized");

          const userId = session.user.id;
          if (text.length < 1) {
            throw new Error("Text must be at least 1 character");
          }

          const newPost = new PostModel({ text, userId: new ObjectId(userId) });
          if (location) newPost.location = location;
          if (image) newPost.image = image;

          const { db } = await connectToDatabase();

          const result = await db
            .collection<PostModel>("posts")
            .insertOne(newPost);
          newPost._id = result.insertedId;

          return PostModel.toDto(newPost);
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    });
  },
});

export const DeletePostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.string("deletePost", {
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (_root, { postId }, { session }) => {
        try {
          if (!session) throw new ForbiddenError("Unauthorized");
          const userId = session.user.id;

          const { db } = await connectToDatabase();

          const user = await db
            .collection<UserModel>("users")
            .findOne({ _id: new ObjectId(userId) });
          if (!user) throw new ForbiddenError("Unauthorized");
          const post = await db
            .collection<PostModel>("posts")
            .findOne({ _id: new ObjectId(postId) });
          if (!post) {
            throw new Error("Post not found");
          }

          if (user.role === "admin") {
            await db
              .collection<PostModel>("posts")
              .findOneAndDelete({ _id: new ObjectId(postId) });
            return "Post deleted successfully";
          }

          if (post.userId.toHexString() !== userId) {
            return "Unauthorized to delete post";
          }

          await db
            .collection<PostModel>("posts")
            .findOneAndDelete({ _id: new ObjectId(postId) });
          return "Post deleted successfully";
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    });
  },
});
