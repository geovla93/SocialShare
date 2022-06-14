import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import isEmail from "isemail";

import { verifyPassword } from "@/lib/auth";
import { UserModel } from "@/models";
import { connectToDatabase } from "@/lib/mongodb";

const isDev = process.env.NODE_ENV !== "production";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        if (!isEmail.validate(credentials.email))
          throw new Error("Email is not valid");

        const { db } = await connectToDatabase();

        const user = await db.collection<UserModel>("users").findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) throw new Error("No user found");

        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) throw new Error("Password is not valid");

        return UserModel.toDto(user);
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  debug: isDev,
});
