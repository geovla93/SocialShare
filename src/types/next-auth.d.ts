/* eslint-disable no-unused-vars */
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

import { Role } from "@/models";

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface Session {
    /** This is an example. You can find me in types/next-auth.d.ts */
    user: User;
  }

  interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
    username: string;
    role: Role;
    image: string;
    bio: string;
  }
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
