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

	console.log(postId, text, userId);

	if (method === "POST") {
		try {
			await dbConnect();

			const post = await Post.findById(postId);
			if (!post) {
				res.status(400).json("Post not found");
				return;
			}

			post.comments.unshift({ text, user: userId });
			await post.save();

			res.status(201).json("Comment created successfully");
		} catch (error) {
			console.log(error);
			res.status(500).json("Comment not created due to some error");
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${method} Not Allowed`);
	}
}
