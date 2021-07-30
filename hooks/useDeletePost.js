import { useMutation, useQueryClient } from "react-query";

import { deletePost } from "@/utils/post";

const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation(deletePost, {
		onMutate: async ({ postId }) => {
			await queryClient.cancelQueries("posts");
			const oldPosts = queryClient.getQueryData("posts");
			queryClient.setQueryData("posts", (data) => ({
				pages: data.pages.map((page) => ({
					posts: page.posts.filter((post) => post._id !== postId),
					nextId: page.nextId,
				})),
				pageParams: data.pageParams,
			}));
			return { oldPosts };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData("posts", context.oldPosts);
		},
		onSettled: () => {
			queryClient.invalidateQueries("posts");
		},
	});
};

export default useDeletePost;
