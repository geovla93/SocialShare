import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/client";
import { v4 as uuidv4 } from "uuid";

import { likePost } from "@/utils/post";

const useLikePost = () => {
	const queryClient = useQueryClient();
	const [session] = useSession();

	return useMutation(likePost, {
		onMutate: async ({ postId, isLiked }) => {
			await queryClient.cancelQueries("posts");
			const oldPosts = queryClient.getQueryData("posts");

			if (isLiked) {
				queryClient.setQueryData("posts", (data) => ({
					pages: data.pages.map((page) => ({
						posts: page.posts.map((post) => {
							if (post._id !== postId) return post;
							const likeIndex = post.likes.findIndex(
								(like) => like.user === session.user._id
							);
							post.likes.splice(likeIndex, 1);
							return post;
						}),
						nextId: page.nextId,
					})),
					pageParams: data.pageParams,
				}));
			} else {
				queryClient.setQueryData("posts", (data) => ({
					pages: data.pages.map((page) => ({
						posts: page.posts.map((post) => {
							if (post._id !== postId) return post;
							post.likes.push({ _id: uuidv4(), user: session.user._id });
							return post;
						}),
						nextId: page.nextId,
					})),
					pageParams: data.pageParams,
				}));
			}

			return { oldPosts };
		},
		onError: (err, { postId, isLiked }, context) => {
			queryClient.setQueryData("posts", context.oldPosts);
		},
		onSettled: () => {
			queryClient.invalidateQueries("posts");
		},
	});
};

export default useLikePost;
