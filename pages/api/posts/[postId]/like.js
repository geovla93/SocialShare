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

	switch (method) {
		case "GET":
			try {
				const post = await Post.findById(postId);
				if (!post) {
					res.status(400).json("Post not found");
					break;
				}

				res.status(200).json(post.likes);
			} catch (error) {
				console.log(error);
				res.status(500).json("Unable to fetch likes due to server error");
			}

			break;
		case "PATCH":
			try {
				const post = await Post.findById(postId);
				if (!post) {
					res.status(400).json("Post not found");
					break;
				}

				const isLiked =
					post.likes.filter((like) => like.user.toString() === userId).length >
					0;
				if (isLiked) {
					res.status(400).json("Post already liked");
					break;
				}

				post.likes.push({ user: userId });
				await post.save();

				res.status(200).json("Post liked successfully");
			} catch (error) {
				console.log(error);
				res.status(500).json("Unable to like post due to server error");
			}

			break;
		default:
			res.setHeader("Allow", ["PATCH", "GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}
