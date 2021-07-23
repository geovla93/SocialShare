import { getSession } from "next-auth/client";

import Post from "@/models/Post";
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
		body: { text },
	} = req;
	const userId = session.accessToken;

	switch (method) {
		case "GET":
			try {
				await dbConnect();

				const post = await Post.findById(postId);
				if (!post) {
					res.status(400).json("Post not found");
					break;
				}

				res.status(201).json(post.comments);
			} catch (error) {
				console.log(error);
				res.status(500).json("Unable to fetch comment due to server error");
			}
			break;
		case "POST":
			try {
				await dbConnect();

				const post = await Post.findById(postId);
				if (!post) {
					res.status(400).json("Post not found");
					break;
				}

				post.comments.unshift({ text, user: userId });
				await post.save();

				res.status(201).json("Comment created successfully");
			} catch (error) {
				console.log(error);
				res.status(500).json("Comment not created due to some error");
			}
			break;
		default:
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}
