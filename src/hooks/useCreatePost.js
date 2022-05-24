import { useMutation, useQueryClient } from "react-query";

import { submitPost } from "@/utils/post";

const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation(submitPost, {
		onSettled: () => {
			queryClient.invalidateQueries("posts");
		},
	});
};

export default useCreatePost;
