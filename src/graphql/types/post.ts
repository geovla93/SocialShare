import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { ForbiddenError } from "apollo-server-micro";
import { ObjectId, WithId } from "mongodb";

import { UserObject } from "./user";
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
        console.log("🚀 ~ file: post.ts ~ line 25 ~ resolve: ~ user", user);
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
      resolve: async (root, { pageNumber }, { session }) => {
        if (!session) {
          throw new ForbiddenError("Not logged in");
        }

        const { db } = await connectToDatabase();

        const size = 4;
        let posts: WithId<PostModel>[] = [];

        if (pageNumber === 1) {
          posts = await db
            .collection<PostModel>("posts")
            .find({}, { limit: size, sort: { createdAt: -1 } })
            .toArray();
          console.log("🚀 ~ file: post.ts ~ line 62 ~ resolve: ~ posts", posts);
        } else {
          const skips = size * (pageNumber - 1);
          posts = await db
            .collection<PostModel>("posts")
            .find({}, { skip: skips, limit: 4, sort: { createdAt: -1 } })
            .toArray();
        }
        const ret = posts.map((post) => PostModel.toDto(post));
        console.log("🚀 ~ file: post.ts ~ line 72 ~ resolve: ~ ret", ret);
        return ret;
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

          const newPost = PostModel.createDocument({
            text,
            userId: new ObjectId(userId),
          });
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
