import { getSession } from "next-auth/client";

import Post from "@/models/Post";
import dbConnect from "@/lib/db/dbConnect";

export default async function handler(req, res) {
	const session = await getSession({ req });

	if (!session) {
		res.status(401).json("Unauthorized user");
		return;
	}

	switch (req.method) {
		case "GET":
			try {
				await dbConnect();

				const posts = await Post.find({})
					.sort({ createdAt: -1 })
					.populate("user")
					.populate("comments.user");

				res.status(200).json(posts);
			} catch (error) {
				res.status(400).json("Could not fetch posts from database");
			}

			break;
		case "POST":
			const { text, location, picUrl } = req.body;
			const userId = session.accessToken;
			console.log(picUrl);

			if (text.length < 1) {
				res.status(400).json("Text must be at least 1 character");
				break;
			}

			try {
				await dbConnect();

				const post = { text, user: userId };
				if (location) post.location = location;
				if (picUrl) post.picUrl = picUrl;

				const newPost = new Post(post);
				await newPost.save();

				res.status(201).json("Post created successfully");
			} catch (error) {
				res.status(400).json("Could not create post");
			}

			break;
		default:
			res.setHeader("Allow", ["POST", "GET"]);
			res.status(405).end(`Method ${req.method} Not Allowed`);
			break;
	}
}
