import { getSession } from "next-auth/client";

import Post from "@/models/Post";
import User from "@/models/User";
import dbConnect from "@/lib/db/dbConnect";

export default async function handler(req, res) {
	const session = await getSession({ req });

	if (!session) {
		res.status(401).json("Unauthorized user");
		return;
	}

	const {
		method,
		query: { postId },
	} = req;
	const userId = session.accessToken;

	if (method === "PATCH") {
		try {
			const post = await Post.findById(postId);
			if (!post) {
				res.status(400).json("Post not found");
				return;
			}

			const isNotLiked =
				post.likes.filter((like) => like.user.toString() === userId).length ===
				0;
			if (isNotLiked) {
				res.status(400).json("Post not liked");
				return;
			}

			const index = post.likes.findIndex(
				(like) => like.user.toString() === userId
			);

			post.likes.splice(index, 1);
			await post.save();

			res.status(200).json("Post unliked successfully");
			return;
		} catch (error) {
			console.log(error);
			res.status(500).json("Unable to like post due to server error");
			return;
		}
	} else {
		res.setHeader("Allow", ["PATCH"]);
		res.status(405).end(`Method ${method} Not Allowed`);
		return;
	}
}
