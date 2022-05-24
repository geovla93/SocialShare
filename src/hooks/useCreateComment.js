import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/client";
import { v4 as uuidv4 } from "uuid";

import { submitComment } from "@/utils/post";

const useCreateComment = () => {
	const queryClient = useQueryClient();
	const [session] = useSession();

	return useMutation(submitComment, {
		onMutate: async ({ postId, text }) => {
			await queryClient.cancelQueries("posts");
			const oldPosts = queryClient.getQueryData("posts");
			queryClient.setQueryData("posts", (data) => ({
				pages: data.pages.map((page) => ({
					posts: page.posts.map((post) => {
						if (post._id !== postId) return post;
						post.comments.unshift({
							_id: uuidv4(),
							text,
							user: session.user,
						});
						return post;
					}),
					nextId: page.nextId,
				})),
				pageParams: data.pageParams,
			}));
			return { oldPosts };
		},
		onError: (err, { postId, text }, context) => {
			queryClient.setQueryData("posts", context.oldPosts);
		},
		onSettled: () => {
			queryClient.invalidateQueries("posts");
		},
	});
};

export default useCreateComment;
