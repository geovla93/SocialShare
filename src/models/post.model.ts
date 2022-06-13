import { ObjectId } from "mongodb";

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
};

export class PostModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  location?: string;
  userId: ObjectId;
  image?: string;
  likesIds: ObjectId[];
  commentsIds: ObjectId[];

  constructor(partial: Partial<PostModel>) {
    Object.assign(this, partial);
  }

  static createDocument(partial: Partial<PostModel>) {
    return new PostModel({
      ...partial,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static toDto(post: PostModel): Post {
    const { _id, likesIds, commentsIds, ...rest } = post;

    return {
      ...rest,
      id: post._id.toHexString(),
      userId: post.userId.toHexString(),
      likesCount: likesIds.length,
      commentsCount: commentsIds.length,
    };
  }
}
