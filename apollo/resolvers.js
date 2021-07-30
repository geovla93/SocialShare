import {
	AuthenticationError,
	UserInputError,
	ForbiddenError,
} from "apollo-server-micro";
import isEmail from "validator/lib/isEmail";

import Post from "@/models/Post";
import User from "@/models/User";
import Follower from "@/models/Follower";
import { hashPassword } from "@/lib/auth/user";

const isDev = process.env.NODE_ENV !== "production";
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const userPng =
	"https://res.cloudinary.com/geovla/image/upload/v1624429463/user_default_jyyipk.png";

export const resolvers = {
	Query: {
		posts: async (root, { pageNumber }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");

				const number = Number(pageNumber);
				const size = 4;

				let posts;
				if (number === 1) {
					posts = await Post.find({})
						.limit(size)
						.sort({ createdAt: -1 })
						.populate("user")
						.populate("comments.user");
				} else {
					const skips = size * (number - 1);
					posts = await Post.find({})
						.skip(skips)
						.limit(4)
						.sort({ createdAt: -1 })
						.populate("user")
						.populate("comments.user");
				}

				return posts;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		isUsernameAvailable: async (root, { username }, context) => {
			try {
				if (username.length < 1) {
					throw new Error("Invalid username");
				}
				if (!regexUserName.test(username)) {
					throw new Error("Invalid username");
				}

				const user = await User.findOne({ username: username.toLowerCase() });
				if (user) return false;

				return true;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		users: async (root, { name }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");

				const users = await User.find({
					name: { $regex: name, $options: "i" },
				});

				return users;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
	},
	Mutation: {
		signUp: async (root, { user, profilePicUrl }, context) => {
			const { name, username, email, password, bio } = user;

			try {
				if (!isEmail(email)) {
					throw new UserInputError("Invalid email");
				}
				if (password.length < 8 || password.length > 16) {
					throw new UserInputError("Password must be at least 6 characters");
				}

				const existingUser = await User.findOne({ email: email.toLowerCase() });
				if (existingUser) {
					throw new UserInputError("User already registered");
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

				return newUser;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		submitPost: async (root, { text, location, picUrl }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");

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
				console.log(error);
				throw new Error(error);
			}
		},
		deletePost: async (root, { postId }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");
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
				console.log(error);
				throw new Error(error);
			}
		},
		likePost: async (root, { postId }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");
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
				console.log(error);
				throw new Error(error);
			}
		},
		unlikePost: async (root, { postId }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");
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
				console.log(error);
				throw new Error(error);
			}
		},
		submitComment: async (root, { postId, text }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");
				const userId = session.accessToken;

				const post = await Post.findById(postId);
				if (!post) {
					throw new Error("Post not found");
				}

				post.comments.unshift({ text, user: userId });
				await post.save();
				return "Comment was successfully created";
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		deleteComment: async (root, { postId, commentId }, { session }) => {
			try {
				if (!session && !isDev) throw new ForbiddenError("Unauthorized");

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
				console.log(error);
				throw new Error(error);
			}
		},
	},
};
