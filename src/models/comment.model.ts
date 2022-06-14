import { ObjectId } from "mongodb";

import { User } from "./user.model";

export type Comment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  userId: string;
  postId: string;
  user?: User;
};

export class CommentModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  userId: ObjectId;
  postId: ObjectId;

  constructor(partial: Partial<CommentModel>) {
    Object.assign(this, partial);
  }

  static createDocument(partial: Partial<CommentModel>) {
    return new CommentModel({
      ...partial,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static toDto(comment: CommentModel): Comment {
    const { _id, userId, postId, ...rest } = comment;

    return {
      ...rest,
      id: _id.toHexString(),
      userId: userId.toHexString(),
      postId: postId.toHexString(),
    };
  }
}
