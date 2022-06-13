import { ObjectId } from "mongodb";

export type Like = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: string;
};

export class LikeModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  userId: ObjectId;
  postId: ObjectId;

  constructor(partial: Partial<LikeModel>) {
    Object.assign(this, partial);
  }

  static createDocument(partial: Partial<LikeModel>) {
    return new LikeModel({
      ...partial,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static toDto(like: LikeModel): Like {
    const { _id, userId, postId, ...rest } = like;

    return {
      ...rest,
      id: like._id.toHexString(),
      userId: userId.toHexString(),
      postId: postId.toHexString(),
    };
  }
}
