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
		query: { postId, commentId },
	} = req;
	const userId = session.accessToken;

	if (method === "DELETE") {
		try {
			await dbConnect();

			const post = await Post.findById(postId);
			if (!post) {
				res.status(400).json("Post not found");
				return;
			}

			const commentIndex = post.comments.findIndex(
				(comment) => comment._id.toString() === commentId
			);
			if (commentIndex === -1) {
				res.status(400).json("Comment not found");
				return;
			}

			post.comments.splice(commentIndex, 1);
			await post.save();

			res.status(200).json("Comment deleted successfully");
			return;
		} catch (error) {
			console.log(error);
			res.status(500).json("Comment not deleted due to some error");
		}
	} else {
		res.setHeader("Allow", ["DELETE"]);
		res.status(405).end(`Method ${method} Not Allowed`);
		return;
	}
}
