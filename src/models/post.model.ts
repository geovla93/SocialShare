import { ObjectId } from "mongodb";

import { Like } from "./like.model";
import { User } from "./user.model";

export type Post = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  location?: string;
  image?: string;
  userId: string;
  commentsCount: number;
  likesCount: number;
  user?: User;
  likes?: Like[];
};

export class PostModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  location?: string;
  userId: ObjectId;
  image?: string;
  likes: number;
  comments: number;

  constructor(partial: Partial<PostModel>) {
    Object.assign(this, partial);
  }

  static createDocument(partial: Partial<PostModel>) {
    return new PostModel({
      ...partial,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static toDto(post: PostModel): Post {
    const { _id, likes, comments, ...rest } = post;

    return {
      ...rest,
      id: _id.toHexString(),
      userId: post.userId.toHexString(),
      likesCount: likes,
      commentsCount: comments,
    };
  }
}
