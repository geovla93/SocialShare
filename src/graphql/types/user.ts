import { ForbiddenError, UserInputError } from "apollo-server-micro";
import {
  objectType,
  stringArg,
  nonNull,
  arg,
  inputObjectType,
  enumType,
  extendType,
} from "nexus";
import isEmail from "isemail";

import { UserModel } from "@/models";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

// Object Types
export const UserObject = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.date("createdAt");
    t.nonNull.date("updatedAt");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("username");
    t.nonNull.string("bio");
    t.nonNull.string("image");
    t.nonNull.field("role", { type: Role });
  },
});

// Mutation Types
export const SignUpMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signUp", {
      type: UserObject,
      args: {
        user: arg({ type: nonNull(SignUpInput) }),
        image: stringArg(),
      },
      resolve: async (_root, { user, image }) => {
        const { name, username, email, password, bio } = user;

        try {
          if (!isEmail.validate(email)) {
            throw new UserInputError("Invalid email");
          }
          if (password.length < 8) {
            throw new UserInputError("Password must be at least 6 characters");
          }

          const { db } = await connectToDatabase();

          const hashedPassword = await hashPassword(password);

          const newUser = new UserModel({
            name,
            username,
            email,
            password: hashedPassword,
            image: image === null ? undefined : image,
            bio,
          });
          const result = await db
            .collection<UserModel>("users")
            .insertOne(newUser);
          newUser._id = result.insertedId;

          return UserModel.toDto(newUser);
        } catch (error: any) {
          if (error.code === 11000) {
            throw new UserInputError("User already registered");
          }
          throw error;
        }
      },
    });
  },
});

// Query Types
export const IsUsernameAvailableQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.boolean("isUsernameAvailable", {
      args: {
        username: nonNull(stringArg()),
      },
      resolve: async (_root, { username }) => {
        try {
          if (username.length < 1) {
            throw new Error("Invalid username");
          }
          if (!regexUserName.test(username)) {
            throw new Error("Invalid username");
          }

          const { db } = await connectToDatabase();

          const user = await db
            .collection<UserModel>("users")
            .findOne({ username: username.toLowerCase() });
          if (user) return false;

          return true;
        } catch (error: any) {
          console.log(error);
          throw new Error(error);
        }
      },
    });
  },
});

export const GetUsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("users", {
      type: UserObject,
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_root, { name }, { session }) => {
        try {
          if (!session) throw new ForbiddenError("Unauthorized");

          const { db } = await connectToDatabase();

          const users = await db
            .collection<UserModel>("users")
            .find({ name: { $regex: name, $options: "i" } })
            .toArray();

          return users.map((user) => UserModel.toDto(user));
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      },
    });
  },
});

// Input Types
export const SignUpInput = inputObjectType({
  name: "SignUpInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("username");
    t.nonNull.string("bio");
  },
});

export const Role = enumType({
  name: "Role",
  members: ["user", "admin"],
});
