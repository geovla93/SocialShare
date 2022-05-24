import { useMutation, useQueryClient } from "react-query";

import { deleteComment } from "@/utils/post";

const useDeleteComment = () => {
	const queryClient = useQueryClient();

	return useMutation(deleteComment, {
		onMutate: async ({ postId, commentId }) => {
			await queryClient.cancelQueries("posts");
			const oldPosts = queryClient.getQueryData("posts");
			queryClient.setQueryData("posts", (data) => ({
				pages: data.pages.map((page) => ({
					posts: page.posts.map((post) => {
						if (post._id !== postId) return post;
						const commentIndex = post.comments.findIndex(
							(comment) => comment._id === commentId
						);
						post.comments.splice(commentIndex, 1);
						return post;
					}),
					nextId: page.nextId,
				})),
				pageParams: data.pageParams,
			}));
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

export default useDeleteComment;
