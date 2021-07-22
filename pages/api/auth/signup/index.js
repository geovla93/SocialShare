import isEmail from "validator/lib/isEmail";

import { hashPassword } from "@/lib/auth/user";
import dbConnect from "@/lib/db/dbConnect";
import User from "@/models/User";
import Follower from "@/models/Follower";

const userPng =
	"https://res.cloudinary.com/geovla/image/upload/v1624429463/user_default_jyyipk.png";

export default async function handler(req, res) {
	const {
		method,
		body: { user, profilePicUrl },
	} = req;

	if (method === "POST") {
		const { name, username, email, password, bio } = user;
		if (!isEmail(email)) {
			res.status(400).json("Invalid email");
			return;
		}
		if (password.length < 8 || password.length > 16) {
			res.status(400).json("Password must be at least 6 characters");
			return;
		}

		try {
			await dbConnect();

			const existingUser = await User.findOne({ email: email.toLowerCase() });
			if (existingUser) {
				res.status(400).json("User already registered");
				return;
			}

			const hashedPassword = await hashPassword(password);

			const newUser = new User({
				name,
				username: username.toLowerCase(),
				email: email.toLowerCase(),
				password: hashedPassword,
				profilePicUrl: profilePicUrl || userPng,
				bio,
			});
			await newUser.save();

			await new Follower({
				user: newUser._id,
				followers: [],
				following: [],
			}).save();

			res.status(201).json("New user was created!");
			return;
		} catch (error) {
			console.log(error);
			return;
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${method} Not Allowed`);
		return;
	}
}
