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
		case "DELETE":
			try {
				await dbConnect();

				const user = await User.findById(userId);
				const post = await Post.findById(postId);
				if (!post) {
					res.status(400).json("Post not found");
					break;
				}

				if (user.role === "admin") {
					await post.remove();
					res.status(200).json("Post deleted successfully");
					break;
				}

				if (post.user.toString() !== userId) {
					res.status(401).json("Unauthorized to delete post");
					break;
				}

				await post.remove();
				res.status(200).json("Post deleted successfully");
			} catch (error) {
				console.log(error);
				res.status(500).json("Post not delete due to some error");
			}
			break;
		case "GET":
			try {
				await dbConnect();

				const post = await Post.findById(postId);
				if (!post) {
					res.status(400).json("Post not found");
					break;
				}

				res.status(200).json(post);
			} catch (error) {
				console.log(error);
				res.status(500).json("Post not deleted due to some error");
			}
			break;
		default:
			res.setHeader("Allow", ["DELETE", "GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}
