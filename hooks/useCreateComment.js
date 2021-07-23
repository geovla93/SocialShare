import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/client";

import { submitComment } from "@/utils/post";

const useCreateComment = () => {
	const queryClient = useQueryClient();
	const [session] = useSession();

	return useMutation(submitComment, {
		onMutate: async ({ postId, text }) => {
			await queryClient.cancelQueries("posts");
			const oldPosts = queryClient.getQueryData("posts");

			queryClient.setQueriesData("posts", (prevPosts) =>
				prevPosts.map((post) => {
					if (post._id !== postId) return post;
					post.comments.unshift({ text, user: session.user });
					return post;
				})
			);

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

export default useCreateComment;
