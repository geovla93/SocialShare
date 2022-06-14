/* eslint-disable no-unused-vars */
import { ObjectId } from "mongodb";

const userPng =
  "https://res.cloudinary.com/geovla/image/upload/v1624429463/user_default_jyyipk.png";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
  username: string;
  role: Role;
  image: string;
  bio: string;
};

export class UserModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  image: string;
  role: Role;

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }

  static createDocument(partial: Partial<UserModel>) {
    return new UserModel({
      ...partial,
      email: partial.email?.toLowerCase(),
      username: partial.username?.toLowerCase(),
      image: partial.image ?? userPng,
      role: partial.role ?? Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static toDto(user: UserModel) {
    const userWithoutPassword = this.exclude(user, "password");
    const { _id, ...rest } = userWithoutPassword;

    return {
      ...rest,
      id: user._id.toHexString(),
    };
  }

  static exclude<User, Key extends keyof User>(
    user: User,
    ...keys: Key[]
  ): Omit<User, Key> {
    return keys.reduce((acc, key) => {
      delete acc[key];
      return acc;
    }, user);
  }
}
