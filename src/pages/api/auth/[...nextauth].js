import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import isEmail from "validator/lib/isEmail";

import { verifyPassword } from "@/lib/auth/user";
import dbConnect from "@/lib/db/dbConnect";
import User from "@/models/User";

const isDev = process.env.NODE_ENV !== "production";

export default NextAuth({
	secret: process.env.JWT_SECRET,
	session: {
		jwt: true,
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
		encryptionKey: process.env.JWT_ENCRYPTION_KEY,
		encryption: true,
	},
	providers: [
		Providers.Credentials({
			async authorize(credentials) {
				if (!isEmail(credentials.email)) throw new Error("Email is not valid");

				try {
					await dbConnect();

					const user = await User.findOne({
						email: credentials.email.toLowerCase(),
					}).select("+password");

					if (!user) throw new Error("No user found");

					const isPasswordValid = await verifyPassword(
						credentials.password,
						user.password
					);
					if (!isPasswordValid) throw new Error("Password is not valid");

					return user;
				} catch (error) {
					throw new Error(error);
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async session(session, token) {
			session.accessToken = token.accessToken;
			session.user = token.user;
			return session;
		},
		async jwt(token, user, account, profile, isNewUser) {
			if (user) {
				token.accessToken = user._id;
				token.user = user;
			}
			return token;
		},
	},
	debug: isDev,
});
