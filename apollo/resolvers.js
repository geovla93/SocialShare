import { AuthenticationError } from "apollo-server-micro";

import Post from "@/models/Post";
import User from "@/models/User";

export const resolvers = {
	Query: {
		posts: async (parent, args, { session }) => {
			try {
				if (!session) throw new AuthenticationError("Unauthorized");

				const posts = await Post.find({})
					.sort({ createdAt: -1 })
					.populate("user")
					.populate("comments.user");

				return posts;
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		},
	},
	Mutation: {
		submitPost: async (parent, { text, location, picUrl }, { session }) => {
			try {
				if (!session) throw new AuthenticationError("Unauthorized");

				const userId = session.accessToken;
				if (text.length < 1) {
					throw new Error("Text must be at least 1 character");
				}

				const post = { text, user: userId };
				if (location) post.location = location;
				if (picUrl) post.picUrl = picUrl;

				const newPost = new Post(post);
				await newPost.save();

				const createdPost = await Post.findById(newPost._id)
					.populate("user")
					.populate("comments.user");

				return createdPost;
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		},
		deletePost: async (parent, { postId }, { session }) => {
			try {
				if (!session) throw new AuthenticationError("Unauthorized");
				const userId = session.accessToken;

				const user = await User.findById(userId);
				const post = await Post.findById(postId);
				if (!post) {
					throw new Error("Post not found");
				}

				if (user.role === "admin") {
					await post.remove();
					return "Post deleted successfully";
				}

				if (post.user.toString() !== userId) {
					return "Unauthorized to delete post";
				}

				await post.remove();
				return "Post deleted successfully";
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		},
		likePost: async (parent, { postId }, { session }) => {
			try {
				if (!session) throw new AuthenticationError("Unauthorized");
				const userId = session.accessToken;

				const post = await Post.findById(postId);
				if (!post) {
					throw new Error("Post not found");
				}

				const isLiked = !!post.likes.find(
					(like) => like.user.toString() === userId
				);
				if (isLiked) return;

				post.likes.push({ user: userId });
				await post.save();

				return;
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		},
		unlikePost: async (parent, { postId }, { session }) => {
			try {
				if (!session) throw new AuthenticationError("Unauthorized");
				const userId = session.accessToken;

				const post = await Post.findById(postId);
				if (!post) {
					throw new Error("Post not found");
				}

				const isNotLiked = !post.likes.find(
					(like) => like.user.toString() === userId
				);
				if (isNotLiked) return "Post not liked";

				const index = post.likes.findIndex(
					(like) => like.user.toString() === userId
				);

				post.likes.splice(index, 1);
				await post.save();
				return "Post unliked successfully";
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		},
		submitComment: async (parent, { postId, text }, { session }) => {
			try {
				if (!session) throw new AuthenticationError("Unauthorized");
				const userId = session.accessToken;

				const post = await Post.findById(postId);
				if (!post) {
					throw new Error("Post not found");
				}

				post.comments.unshift({ text, user: userId });
				await post.save();
				return "Comment was successfully created";
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		},
		deleteComment: async (parent, { postId, commentId }, { session }) => {
			try {
				if (!session) throw new AuthenticationError("Unauthorized");

				const post = await Post.findById(postId);
				if (!post) {
					throw new Error("Post not found");
				}

				const commentIndex = post.comments.findIndex(
					(comment) => comment._id.toString() === commentId
				);
				if (commentIndex === -1) return "Comment not found";

				post.comments.splice(commentIndex, 1);
				await post.save();
				return "Comment deleted successfully";
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		},
	},
};
